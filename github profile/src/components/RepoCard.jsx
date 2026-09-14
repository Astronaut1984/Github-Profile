import License from "../assets/License.svg?react";
import ForkIcon from "../assets/Fork.svg?react";
import StarIcon from "../assets/Star.svg?react";

function RepoCard({ repo }) {
  function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  function getDaysSinceUpdate(startDate) {
    const endDate = new Date();
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysAgo = Math.round(
      (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay,
    );
    switch (daysAgo) {
      case 0:
        return "Today";
        break;
      case 1:
        return `${daysAgo} day ago`;
        break;
      default:
        return `${daysAgo} days ago`;
        break;
    }
  }

  return (
    <div
      className="card-gradient rounded-lg p-5 **:truncate cursor-pointer"
      onClick={() => {
        window.open(repo.html_url, "_blank");
      }}
    >
      <h3 className="text-foreground font-semibold text-lg">{repo.name}</h3>
      <p className="text-muted mt-1 text-sm">{repo.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-muted text-sm">
        {repo.license && (
          <span className="flex items-center gap-1">
            <License className="w-4 h-4" /> {repo.license?.spdx_id}
          </span>
        )}
        <span className="flex items-center gap-1">
          <ForkIcon className="w-4 h-4" /> {repo.forks_count}
        </span>
        <span className="flex items-center gap-1">
          <StarIcon className="w-4 h-4" /> {repo.stargazers_count}
        </span>
        <span className="ml-auto">
          Updated {getDaysSinceUpdate(repo.updated_at)}
        </span>{" "}
      </div>
    </div>
  );
}

export default RepoCard;
