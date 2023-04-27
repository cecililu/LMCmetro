import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillInfoCircle } from "react-icons/ai";
// import { BiAlarm } from "react-icons/bi";
import { string } from "yup";
import AccordianDyn from "../UI/DynamicAccord";
import { BiAlarm } from "react-icons/bi";
import { setlatlng } from "./../../store/Slices/latlng";
import { BiAlarm } from "react-icons/bi";
const ActiveManage = ({ changeMarkerDataState }) => {
  const [wardIncident, setWardIncident] = useState([]);
  const wardId = localStorage.getItem("WardId");
  let now = new Date();
  let oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  let today = now.toISOString().slice(0, 10);
  let lastMonth = oneMonthAgo.toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);
  const WardIncident = async (wardId, startDate, endDate) => {
    let data = await fetch(
      `http://127.0.0.1:8000/api/v1/disaster/disasterEvent/?name=&Ward=${wardId}&type=&is_closed=&startTime__gte=${startDate}&startTime__gt=&startTime__lt=${endDate}`
    );
    let wardIncident = await data.json();

    changeMarkerDataState(wardIncident);
    setWardIncident(wardIncident);
  }
  let dispatch = useDispatch();
  const latlngHandler = (array) => {
    dispatch(setlatlng(array));}

  useEffect(() => {
    WardIncident(wardId, lastMonth, today);
  }, []);
  return (
    <React.Fragment>
   <AccordianDyn AllDisaster={wardIncident}   latlngHandler={latlngHandler}></AccordianDyn>
  const handleSubmit = (event) => {
    event.preventDefault();
    WardIncident(wardId, startDate, endDate);
  };
  return (
    <React.Fragment>
      <div className="flex items-center ">
        <div className="w-1/2 ">
          <label
            className="block text-xs text-gray-700 font-medium mb-1"
            htmlFor="start-date"
          >
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            className="block w-full border p-1 appearance-none focus:outline-none focus:border-indigo-500"
            value={startDate || lastMonth}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className=" w-1/2 m-2">
          <label
            className="block text-xs text-gray-700 font-medium mb-1"
            htmlFor="end-date"
          >
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            className="block w-full   border p-1 appearance-none focus:outline-none focus:border-indigo-500"
            value={endDate || today}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-teal-500 mt-5 text-white p-1"
        >
          Submit
        </button>
      </div>
      {wardIncident ? (
        <>
          {wardIncident.map((data) => {
            return (
              <div className="border-gray-200 border-b-2 p-1 hover:bg-gray-200 py-2">
                <div className="text-md font-medium flex flex-row ">
                  <div className="text-red-500 text-sm flex flex-col">
                    <span className="px-3">
                      {" "}
                      <img
                        className="w-9 h-6 pt-1 mt-1"
                        src={`http://127.0.0.1:8000/${data?.type?.title}.svg`}
                      />
                    </span>
                    <p className="text-xs text-black mx-6 my-1">
                      {data?.type?.title || "none"}
                    </p>
                  </div>
                  <span className="font-normal ml-2 mt-1 pt-1 text-sm">
                    <div className="font-semibold text-xs"> {data.name}</div>
                    <div>
                      <div className="text-xs  text-gray-500 flex justify-start ">
                        <div className="flex items-center my-1">
                          <span>
                            <BiAlarm />
                          </span>
                          <span className="mx-2">
                            {data.date_event.slice(0, 10)}
                          </span>
                          <span className="ml-2">
                            {data.date_event.slice(11, 16)}
                          </span>
                          <span className="ml-2">WARD-{data.Ward.ward}</span>
                          <span className="ml-3">
                            {data.ADDRESS || "Dhapakhel,Gems School"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default ActiveManage;
