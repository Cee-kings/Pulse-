import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/components/AuthProvider";
import LoginScreen from "@/components/LoginScreen";
import Navbar from "@/components/Navbar";
import HomeFeed from "@/pages/HomeFeed";
import WritePage from "@/pages/WritePage";
import PostPage from "@/pages/PostPage";
import AuthorProfile from "@/pages/AuthorProfile";
import ProfilePage from "@/pages/ProfilePage";
import DiscoverPage from "@/pages/DiscoverPage";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="absolute -bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <MeshBackground />
        <LoginScreen />
      </>
    );
  }

  return (
    <>
      <MeshBackground />
      <Navbar />
      <Switch>
        <Route path="/" component={HomeFeed} />
        <Route path="/write" component={WritePage} />
        <Route path="/post/:id" component={PostPage} />
        <Route path="/discover" component={DiscoverPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/author/:id" component={AuthorProfile} />
        <Route>
          <div className="max-w-2xl mx-auto px-6 py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>
            <a href="/" className="text-primary hover:underline text-sm">← Back to home</a>
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
