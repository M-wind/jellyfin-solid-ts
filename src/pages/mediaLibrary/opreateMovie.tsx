import { BiSolidFolderMinus } from "solid-icons/bi";
import { For, Show, createResource } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { CheckBoxWithLabelOrder } from "../../components/checkbox";
import Selector from "../../components/selector";
import PathSelector from "../../components/selector/pathSelector";
import { ToggleLabel, ToggleLabelArr } from "../../components/toggle";
import { useAppContext } from "../../context/AppContext";
import {
	addFolderPath,
	deleteFolderPath,
	getAvailableOptions,
	getCountry,
	getCulture,
} from "../../helper/api";
import { EveryNDays } from "../../helper/option";
import { convertAvilableOptions, getValuesFromKey } from "../../helper/utils";
import type { Options } from "./opreate";

type OpreateMovieProps = {
	options: LibraryOptions;
	update: SetStoreFunction<Options>;
	id?: string;
	name?: string;
};

const OpreateMovie = (props: OpreateMovieProps) => {
	const { t } = useAppContext();

	const fetcherCul = async () => {
		return [{ Name: "", Value: "" }, ...(await getCulture())];
	};

	const fetcherCou = async () => {
		return [{ Name: "", Value: "" }, ...(await getCountry())];
	};

	const fetcherAvilableOptions = async () => {
		let data: AvailableOptionsConvert;
		if (!!props.id) {
			data = reInitOption(props.options);
		} else {
			data = convertAvilableOptions(await getAvailableOptions("movies"));
			initTypeOptions(data.TypeOptions);
		}
		return data;
	};

	const reInitOption = (data: LibraryOptions): AvailableOptionsConvert => {
		const m = data.TypeOptions.find((v) => v.Type === "Movie");
		const meta = reInit(
			m?.MetadataFetcherOrder || [],
			m?.MetadataFetchers || [],
		);
		const image = reInit(m?.ImageFetcherOrder || [], m?.ImageFetchers || []);
		const savers = reInit(data.LocalMetadataReaderOrder, data.MetadataSavers);
		return {
			MetadataSavers: savers,
			TypeOptions: {
				Movie: {
					ImageFetchers: image,
					MetadataFetchers: meta,
					Type: "Movie",
				},
			},
		};
	};

	const reInit = (arrOrder: string[], arr: string[]): ToggleDataType[] => {
		return arrOrder.map((v) => {
			return arr.indexOf(v) === -1
				? { Name: v, DefaultEnabled: false }
				: { Name: v, DefaultEnabled: true };
		});
	};

	const initTypeOptions = (data: TypeOptionsConvert) => {
		const a = getValuesFromKey(data["Movie"].ImageFetchers, "Name");
		const b = getValuesFromKey(data["Movie"].MetadataFetchers, "Name");
		const d: TypeOption[] = [
			{
				Type: "Movie",
				ImageFetchers: a,
				ImageFetcherOrder: a,
				MetadataFetchers: b,
				MetadataFetcherOrder: b,
			},
		];
		props.update("libraryOptions", "TypeOptions", d);
	};

	const onPathChoose = (path: string) => {
		if (!!props.id) {
			addFolderPath(props.name!, { Path: path }).then((v) => {
				if (v.ok) pathAdd(path);
			});
			return;
		}
		pathAdd(path);
	};

	const onPathDelete = (path: string, index: number) => {
		if (!!props.id) {
			deleteFolderPath(props.name!, path).then((v) => {
				if (v.ok) pathDelete(index);
			});
			return;
		}
		pathDelete(index);
	};

	const pathAdd = (path: string) => {
		const data = [...props.options.PathInfos];
		if (data.some((v) => v.Path === path)) return;
		data.push({ Path: path });
		props.update("libraryOptions", "PathInfos", data);
	};

	const pathDelete = (index: number) => {
		const data = [...props.options.PathInfos];
		data.splice(index, 1);
		props.update("libraryOptions", "PathInfos", data);
	};

	const [culture] = createResource(fetcherCul);
	const [country] = createResource(fetcherCou);
	const [avilableOptions] = createResource(fetcherAvilableOptions);

	const updateByType = (
		type: MediaType | SeriesOption,
		key: keyof TypeOption,
		v: string[],
	) => {
		props.update(
			"libraryOptions",
			"TypeOptions",
			(v) => v.Type === type,
			key,
			v,
		);
	};

	return (
		<div class="grid grid-cols-3 auto-rows-auto gap-6 animate-fadeIn max-md:grid-cols-1">
			<div class="flex flex-col gap-2 w-full min-w-56">
				<Show when={culture.state === "ready"}>
					<div>
						<div class="text-minor">{t("LabelMetadataDownloadLanguage")}</div>
						<Selector
							id="PreferredMetadataLanguage"
							default={props.options.PreferredMetadataLanguage}
							data={culture()}
							onSelect={(v) =>
								props.update(
									"libraryOptions",
									"PreferredMetadataLanguage",
									v.Value,
								)
							}
						/>
					</div>
				</Show>
				<Show when={country.state === "ready"}>
					<div>
						<div class="text-minor">{t("LabelCountry")}</div>
						<Selector
							id="MetadataCountryCode"
							default={props.options.MetadataCountryCode}
							data={country()}
							onSelect={(v) =>
								props.update("libraryOptions", "MetadataCountryCode", v.Value)
							}
						/>
					</div>
				</Show>
				{/* <div>
          <div class='text-minor'>{t('AllowEmbeddedSubtitles')}</div>
          <Selector
            id='AllowEmbeddedSubtitles'
            default={props.options.AllowEmbeddedSubtitles}
            data={EmbeddedSubtitles(t)}
            onSelect={(v) => props.update('libraryOptions', 'AllowEmbeddedSubtitles', v.Value)}
            readonly
          />
        </div> */}
				<div>
					<div class="text-primary">{t("Folders")}</div>
					<PathSelector id="PathInfos" onSelect={onPathChoose} />
					<div class="flex overflow-y-auto overflow-x-hidden flex-col items-center max-h-40 scrollbar-none">
						<For each={props.options.PathInfos}>
							{(v, i) => (
								<div class="relative py-3 pr-10 pl-6 mt-1 w-full h-12 text-left rounded-md shadow-lg appearance-none outline-none focus:ring-1 bg-component focus:ring-primary">
									<span class="flex items-center">
										<span class="block truncate">{v.Path}</span>
									</span>
									<span
										onClick={() => onPathDelete(v.Path, i())}
										class="flex absolute inset-y-1 right-2 justify-center items-center w-10 h-10 rounded-md cursor-pointer hover:text-error"
									>
										<BiSolidFolderMinus />
									</span>
								</div>
							)}
						</For>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-3 w-full min-w-56">
				<Show when={avilableOptions.state === "ready"}>
					<div>
						<div class="text-minor">
							{t("LabelTypeMetadataDownloaders", [t("Movies")])}
						</div>
						<CheckBoxWithLabelOrder
							key="MovieMetadatFetcher"
							arr={
								avilableOptions()?.TypeOptions["Movie"].MetadataFetchers || []
							}
							ordered={(v) => updateByType("Movie", "MetadataFetcherOrder", v)}
							checked={(v) => updateByType("Movie", "MetadataFetchers", v)}
						/>
					</div>
					<div>
						<div class="text-minor">
							{t("HeaderTypeImageFetchers", [t("Movies")])}
						</div>
						<CheckBoxWithLabelOrder
							key="MovieImagetFetcher"
							arr={avilableOptions()?.TypeOptions["Movie"].ImageFetchers || []}
							ordered={(v) => updateByType("Movie", "ImageFetcherOrder", v)}
							checked={(v) => updateByType("Movie", "ImageFetchers", v)}
						/>
					</div>
					<div>
						<div class="text-minor">
							{t("LabelAutomaticallyRefreshInternetMetadataEvery")}
						</div>
						<Selector
							id="AutomaticRefreshIntervalDays"
							default={props.options.AutomaticRefreshIntervalDays}
							data={EveryNDays(t)}
							onSelect={(v) =>
								props.update(
									"libraryOptions",
									"AutomaticRefreshIntervalDays",
									v.Value,
								)
							}
							readonly={true}
						/>
					</div>
				</Show>
			</div>
			<div class="flex flex-col gap-3 w-full min-w-56">
				<div>
					<ToggleLabel
						title={t("PreferEmbeddedTitlesOverFileNames")}
						id="EnableEmbeddedTitles"
						checked={props.options.EnableEmbeddedTitles}
						onChecked={(v) =>
							props.update("libraryOptions", "EnableEmbeddedTitles", v)
						}
					/>
					<ToggleLabel
						title={t("LabelEnableRealtimeMonitor")}
						id="EnableRealtimeMonitor"
						checked={props.options.EnableRealtimeMonitor}
						onChecked={(v) =>
							props.update("libraryOptions", "EnableRealtimeMonitor", v)
						}
					/>
					<ToggleLabel
						title={t("LabelAutomaticallyAddToCollection")}
						id="AutomaticallyAddToCollection"
						checked={props.options.AutomaticallyAddToCollection}
						onChecked={(v) =>
							props.update("libraryOptions", "AutomaticallyAddToCollection", v)
						}
					/>
				</div>
				<div>
					<div class="text-minor">{t("HeaderChapterImages")}</div>
					<ToggleLabel
						title={t("OptionExtractChapterImage")}
						id="EnableChapterImageExtraction"
						checked={props.options.EnableChapterImageExtraction}
						onChecked={(v) =>
							props.update("libraryOptions", "EnableChapterImageExtraction", v)
						}
					/>
					<ToggleLabel
						title={t("LabelExtractChaptersDuringLibraryScan")}
						id="ExtractChapterImagesDuringLibraryScan"
						checked={props.options.ExtractChapterImagesDuringLibraryScan}
						onChecked={(v) =>
							props.update(
								"libraryOptions",
								"ExtractChapterImagesDuringLibraryScan",
								v,
							)
						}
					/>
					<ToggleLabel
						title={t("LabelSaveLocalMetadata")}
						id="SaveLocalMetadata"
						checked={props.options.SaveLocalMetadata}
						onChecked={(v) =>
							props.update("libraryOptions", "SaveLocalMetadata", v)
						}
					/>
				</div>
				<Show when={avilableOptions.state === "ready"}>
					<div>
						<div class="text-minor">{t("LabelMetadataSavers")}</div>
						<ToggleLabelArr
							key="MetadataSavers"
							arr={avilableOptions()?.MetadataSavers || []}
							onChecked={(v) =>
								props.update("libraryOptions", "MetadataSavers", v)
							}
						/>
					</div>
				</Show>
			</div>
		</div>
	);
};

export default OpreateMovie;
