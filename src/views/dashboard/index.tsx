import AppBar from "../../components/appbar";
import LiveScores from "../live_scores";
import TrendingNews from "../trending_news";

const Dashboard = () => {
  return (
    <>
      <div>
        <AppBar></AppBar>
      </div>
      <div>
        <LiveScores></LiveScores>
      </div>
      <div>
        <TrendingNews></TrendingNews>
      </div>
    </>
  );
};

export default Dashboard;
