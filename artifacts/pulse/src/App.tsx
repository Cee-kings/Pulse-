import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import HomeFeed from "@/pages/HomeFeed";
import WritePage from "@/pages/WritePage";
import PostPage from "@/pages/PostPage";
import AuthorProfile from "@/pages/AuthorProfile";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={HomeFeed} />
        <Route path="/write" component={WritePage} />
        <Route path="/post/:id" component={PostPage} />
        <Route path="/author/:id" component={AuthorProfile} />
        <Route>
          <div className="max-w-2xl mx-auto px-6 py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>
            <a href="/" className="text-primary hover:underline text-sm">
              ← Back to home
            </a>
          </div>
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
