import ErrorBoundary from "../../components/ErrorBoundary";
import Article from "../../components/article";

const TrendingNews = () => {
  return (
    <>
      <h1 className="text-5xl mx-4 my-6 text-bold">Trending News</h1>
      <ErrorBoundary>
        <Article></Article>
      </ErrorBoundary>
    </>
  );
};

export default TrendingNews;
