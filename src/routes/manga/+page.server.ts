import type {PageServerLoad} from "./$types"
import {getHomeLayoutApi} from "$lib/server/home.layout.api";
import {advanceSearchManga} from "$lib/server/mangaSearch.api";
import {getAllFilters} from "$lib/server/availableFilters.api";

export const load: PageServerLoad = async () => {
    return {
        trending: getHomeLayoutApi(),
        result: advanceSearchManga(1),
        filters: getAllFilters()
    }
};
