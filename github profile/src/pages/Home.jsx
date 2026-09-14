// import userData from "../profile.json";
// import userRepos from "../repos.json";
import InfoBox from "../components/InfoBox";
import RepoCard from "../components/RepoCard";
import SearchIcon from "../assets/Search.svg?react";
import { useEffect, useState } from "react";
import GithubSearchBox from "../components/SearchBox";

function Home() {
  useEffect(() => {
    console.log(userRepos);
  }, []);

  const [userData, setUserData] = useState(null);
  const [userRepos, setUserRepos] = useState(null);
  const setData = async (user_url, repos_url) => {
    const user = await fetch(user_url);
    const repos = await fetch(repos_url);
    if (user.ok && repos.ok) {
      const userJSON = await user.json();
      const repoJSON = await repos.json();
      console.log(userJSON);
      setUserData(userJSON);
      setUserRepos(repoJSON);
    }
  };
  return (
    <>
      <div className="bg-background min-h-screen flex flex-col">
        {/* Banner */}
        <div className="relative">
          <img
            src="src\assets\hero-image-github-profile-sm.jpg"
            alt=""
            className="w-full h-44 sm:h-56 lg:h-60 object-cover"
          />

          {/* Search bar: full-width overlay on mobile, top-right box on sm+ */}
          <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 sm:w-72 lg:w-96">
            <GithubSearchBox setData={setData} />
          </div>

          {/* Avatar overlaps bottom edge of banner */}
          {userData && userRepos && (
            <img
              src={userData.avatar_url}
              alt=""
              className="absolute -bottom-10 left-5 lg:left-10 w-20 h-20 lg:w-28 lg:h-28 rounded-2xl border-4 border-background object-cover bg-background"
            />
          )}
        </div>
        {userData && userRepos && (
          <>
            {/* Avatar spacer + info boxes row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-5 lg:px-10 mt-14 lg:mt-6">
              <div className="hidden lg:block lg:w-28 shrink-0" />{" "}
              {/* matches avatar width so info boxes align next to it */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <InfoBox title="Followers" content={userData.followers} />
                <InfoBox title="Following" content={userData.following} />
                <InfoBox title="Location" content={userData.location} />
              </div>
            </div>

            {/* Name + tagline */}
            <div className="px-5 lg:px-10 mt-6">
              <h1 className="text-foreground text-2xl lg:text-3xl font-bold">
                {userData.name}
              </h1>
              <p className="text-muted mt-1">{userData.bio}</p>{" "}
              {/* TODO: confirm field name in profile.json */}
            </div>

            {/* Repo cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5 lg:px-10 mt-8">
              {userRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} /> // TODO: confirm repos.json has a unique `id` field
              ))}
            </div>

            {/* View all link */}
            <div className="text-center py-8">
              <a
                href={userData.html_url}
                target="_blank"
                className="text-foreground hover:underline underline-offset-4"
              >
                View all repositories
              </a>
            </div>
          </>
        )}

        {!userData && !userRepos && (
          <>
            <div className="h-full w-full flex flex-col justify-center items-center grow">
              <SearchIcon className="font-bold w-25" />
              <h1 className="text-5xl font-bold text-foreground">
                Start Searching for a user
              </h1>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
