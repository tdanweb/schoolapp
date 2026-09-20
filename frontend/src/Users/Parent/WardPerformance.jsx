import axios from "axios";
import { mainApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Users,
  GraduationCap,
  TrendingUp,
  BookOpen,
  ChevronRight,
} from "lucide-react";



export default function WardPerformance() {
  const navi = useNavigate();

  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState([]);
  const [scores, setScores] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [selectedWard, setSelectedWard] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function getDetails() {
    const savedUser = JSON.parse(localStorage.getItem("logged-user"));

    if (!savedUser || savedUser.role !== "parent") {
      navi("/app/user");
      return;
    }

    const api = `${mainApi}/results/weekly/student?regNo=${savedUser.user}`;

    try {
      setLoading(true);

      const res = await axios.get(api);

      console.log(res.data);

      if (res.data.success) {
        setWards(res.data.wardList || []);
        setScores(res.data.thisTermScores || []);
        setAppSettings(res.data.appSettings || {});

        // Select first ward automatically
        if (res.data.wardList?.length > 0) {
          setSelectedWard(res.data.wardList[0].admissionNo);
        }
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        setErrorMsg(
          error.response.data?.msg || "Unable to fetch ward performance."
        );
      } else {
        setErrorMsg("Network/Server Error..");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);


  /*
  -------------------------------------------------------
  GET SCORES BELONGING TO SELECTED WARD
  -------------------------------------------------------
  */
  const wardScores = useMemo(() => {
    if (!selectedWard) return [];

    return scores.filter(
      (item) => item.admissionNo === selectedWard
    );
  }, [scores, selectedWard]);


  /*
  -------------------------------------------------------
  SUBJECT LIST
  -------------------------------------------------------
  */
  const selectedWardInfo = useMemo(() => {
    return wards.find(
      (ward) => ward.admissionNo === selectedWard
    );
  }, [wards, selectedWard]);


  /*
  -------------------------------------------------------
  SUBJECT FILTER
  -------------------------------------------------------
  */
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  useEffect(() => {
    setSelectedSubject("All Subjects");
  }, [selectedWard]);


  /*
  -------------------------------------------------------
  WEEKLY PERFORMANCE DATA
  -------------------------------------------------------

  Converts:

  score 18 / max 30

  into:

  60%

  If several records exist in the same week,
  they are averaged.
  -------------------------------------------------------
  */
  const weeklyData = useMemo(() => {
    let filteredScores = wardScores;

    if (selectedSubject !== "All Subjects") {
      filteredScores = wardScores.filter(
        (item) => item.subject === selectedSubject
      );
    }

    const weekMap = {};

    filteredScores.forEach((item) => {
      const week = Number(item.week);

      if (!weekMap[week]) {
        weekMap[week] = {
          week,
          totalScore: 0,
          totalMax: 0,
        };
      }

      weekMap[week].totalScore += Number(item.score || 0);
      weekMap[week].totalMax += Number(item.max || 0);
    });

    return Object.values(weekMap)
      .sort((a, b) => a.week - b.week)
      .map((item) => ({
        week: `Week ${item.week}`,
        percentage:
          item.totalMax > 0
            ? Number(
                ((item.totalScore / item.totalMax) * 100).toFixed(1)
              )
            : 0,
      }));
  }, [wardScores, selectedSubject]);


  /*
  -------------------------------------------------------
  CURRENT AVERAGE
  -------------------------------------------------------
  */
  const currentAverage = useMemo(() => {
    if (!weeklyData.length) return 0;

    const total = weeklyData.reduce(
      (sum, item) => sum + item.percentage,
      0
    );

    return (total / weeklyData.length).toFixed(1);
  }, [weeklyData]);


  /*
  -------------------------------------------------------
  BEST WEEK
  -------------------------------------------------------
  */
  const bestWeek = useMemo(() => {
    if (!weeklyData.length) return null;

    return weeklyData.reduce((best, item) =>
      item.percentage > best.percentage ? item : best
    );
  }, [weeklyData]);


  /*
  -------------------------------------------------------
  LOADING
  -------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="ward-performance-page">
        <div className="wp-loading">
          Loading ward performance...
        </div>
      </div>
    );
  }


  /*
  -------------------------------------------------------
  ERROR
  -------------------------------------------------------
  */
  if (errorMsg) {
    return (
      <div className="ward-performance-page">
        <div className="wp-error">
          {errorMsg}
        </div>
      </div>
    );
  }


  return (
    <div className="ward-performance-page">

      {/* HEADER */}
      <div className="wp-header">
        <div>
          <h1>Ward Performance</h1>

          <p>
            Weekly Continuous Assessment
          </p>
        </div>

        <div className="wp-session">
          <span>{appSettings.currentSession}</span>
          <span>•</span>
          <span>{appSettings.currentTerm} Term</span>
        </div>
      </div>


      {/* TOP SUMMARY */}
      <div className="wp-summary">

        <div className="wp-summary-card">
          <div className="wp-summary-icon">
            <Users size={21} />
          </div>

          <div>
            <small>Total Wards</small>
            <strong>{wards.length}</strong>
          </div>
        </div>


        <div className="wp-summary-card">
          <div className="wp-summary-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <small>Current Week</small>
            <strong>{appSettings.schoolWeek || "-"}</strong>
          </div>
        </div>


        <div className="wp-summary-card">
          <div className="wp-summary-icon">
            <TrendingUp size={21} />
          </div>

          <div>
            <small>Ward Selected</small>
            <strong>
              {selectedWardInfo?.fullname?.split(" ")[0] || "-"}
            </strong>
          </div>
        </div>

      </div>


      {/* WARD CARDS */}
      <div className="wp-section-title">
        <div>
          <h2>Your Wards</h2>
          <p>Select a ward to view performance.</p>
        </div>
      </div>


      <div className="ward-selector">

        {wards.map((ward) => {
          const active =
            selectedWard === ward.admissionNo;

          return (
            <button
              key={ward.admissionNo}
              className={`ward-card ${active ? "active" : ""}`}
              onClick={() => setSelectedWard(ward.admissionNo)}
            >
              <div className="ward-card-icon">
                <GraduationCap size={23} />
              </div>

              <div className="ward-card-info">
                <strong>{ward.fullname}</strong>

                <span>
                  {ward.classId}
                </span>

                <small>
                  {ward.admissionNo}
                </small>
              </div>

              <ChevronRight size={19} />
            </button>
          );
        })}

      </div>


      {/* PERFORMANCE */}
      {selectedWardInfo && (
        <div className="performance-card">

          {/* PERFORMANCE HEADER */}
          <div className="performance-card-header">

            <div>
              <span className="performance-label">
                WEEKLY PERFORMANCE
              </span>

              <h2>
                {selectedWardInfo.fullname}
              </h2>

              <p>
                {selectedWardInfo.classId} •{" "}
                {selectedWardInfo.admissionNo}
              </p>
            </div>


            {/* SUBJECT FILTER */}
            <div className="subject-filter">
              <label>Subject</label>

              <select
                value={selectedSubject}
                onChange={(e) =>
                  setSelectedSubject(e.target.value)
                }
              >
                <option value="All Subjects">
                  All Subjects
                </option>

                {selectedWardInfo.subjects?.map(
                  (subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>


          {/* STAT CARDS */}
          <div className="performance-stats">

            <div className="performance-stat">
              <span>Average</span>

              <strong>
                {currentAverage}%
              </strong>
            </div>


            <div className="performance-stat">
              <span>Best Week</span>

              <strong>
                {bestWeek
                  ? bestWeek.percentage + "%"
                  : "--"}
              </strong>

              {bestWeek && (
                <small>{bestWeek.week}</small>
              )}
            </div>


            <div className="performance-stat">
              <span>Records</span>

              <strong>
                {wardScores.length}
              </strong>
            </div>

          </div>


          {/* CHART */}
          <div className="chart-wrapper">

            <div className="chart-heading">
              <div>
                <h3>
                  {selectedSubject === "All Subjects"
                    ? "Overall Weekly Average"
                    : `${selectedSubject} — Weekly Performance`}
                </h3>

                <p>
                  Average score percentage by week
                </p>
              </div>
            </div>


            {weeklyData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={330}
              >
                <LineChart
                  data={weeklyData}
                  margin={{
                    top: 15,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="week"
                  />

                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      "Average",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="percentage"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-performance">
                <BookOpen size={35} />

                <h3>No CA records yet</h3>

                <p>
                  There are no weekly CA records available
                  for this subject.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}