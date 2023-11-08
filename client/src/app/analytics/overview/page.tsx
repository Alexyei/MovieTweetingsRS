import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import RecentSalesTable from "@/components/tables/RecentSales/RecentSales";
import TopSalesTable from "@/components/tables/TopSales/TopSales";
import RatingDistributionCard from "@/components/cards/RatingDistributionCard/RatingDistributionCard";
import ConversionCard from "@/components/cards/ConversionCard/ConversionCard";
import OverviewCardPanel from "@/components/cards/OverviewCardPanel/OverviewCardPanel";

export default async function Page() {

    return (
        <ServerAdminRoute>
            <OverviewCardPanel/>
                <div className="lg:grid flex flex-col w-full gap-4 lg:grid-cols-2">
                    <RatingDistributionCard/>
                    <ConversionCard/>
                </div>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <RecentSalesTable/>
                <TopSalesTable/>
            </div>
        </ServerAdminRoute>
    )
}