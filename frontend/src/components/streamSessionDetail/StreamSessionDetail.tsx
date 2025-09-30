import { useParams } from "react-router-dom";
import NavigateButton from "@components/navigateButton";
import SlideShow from "@components/slideShow";
import { useGetSessionById } from "@services";
import { DateTooltip } from "@components/dateTooltip";
import StreamSessionEvents from "@components/streamSessionEvents";
import { Error, Loading } from "@components/axiosHelper";
import { lazy } from "react";
const LineChart = lazy(() => import("@components/lineChart"));

export default function StreamSessionDetail() {
  const { sessionId } = useParams();
  const {
    data: sessionData,
    isLoading,
    error,
  } = useGetSessionById(sessionId || "");

  if (error) return <Error error={error} />;
  if (!sessionData || isLoading) return <Loading />;

  const { data } = sessionData;

  const calculateTimeStream = (startDate: Date, endDate: Date) => {
    return (
      (new Date(startDate).getTime() - new Date(endDate).getTime()) /
      1000 /
      60 /
      60
    ).toPrecision(2);
  };

  return (
    <>
      <NavigateButton />
      <div className="stream-session-details-wrapper">
        <div className="detail-section-wrapper">
          <div>
            <div>Session start:</div>
            <div>
              <DateTooltip date={data.sessionStart} />
            </div>
            <div>Session time:</div>
            <div>
              {calculateTimeStream(data.sessionEnd, data.sessionStart)}h
            </div>
            <div>Session end:</div>
            <div>
              {data.sessionEnd ? <DateTooltip date={data.sessionEnd} /> : null}
            </div>
          </div>
        </div>

        <div className="detail-section-wrapper-big">
          <div>
            <div className="section-name">Titles</div>
            {Object.keys(data.sessionTitles).map((timestamp, index) => (
              <div key={index} className="session-big-data-wrapper">
                <div>
                  <DateTooltip date={Number(timestamp)} />
                </div>
                <div> {data.sessionTitles[timestamp]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="detail-section-wrapper-big">
          <div>
            <div className="section-name">Categories</div>
            {Object.keys(data.categories).map((timestamp, index) => (
              <div key={index} className="session-big-data-wrapper">
                <div>
                  <DateTooltip date={Number(timestamp)} />
                </div>
                <div> {data.categories[timestamp]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section-wrapper-big max">
          <div>
            <SlideShow styleWrapper={{ width: "37vmax" }}>
              {data.viewers ? (
                <LineChart
                  data={data.viewers}
                  chartOptions={{ title: "Viewers peek", label: "viewers" }}
                />
              ) : null}
            </SlideShow>
          </div>
          <div>
            {data.events ? (
              <div>
                <StreamSessionEvents sessionEvents={data.events} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
