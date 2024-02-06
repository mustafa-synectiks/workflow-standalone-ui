"use client";
import api from "@/api";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Search from "../../../../../public/assets/Search3.svg";

export default function page() {
  const [usecase, setUsecase] = useState([]);
  const [stages, setStages] = useState([]);

  // useEffect to fetch all API Developers

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await api.get("/usecase", {
          params: {
            project_id: "7d3e0b6d-6aaf-425e-9187-7bd84427434f",
            workflow_id: "1c286666-d68c-45f3-a8bc-f3d32ed6504b",
          },
        });
        console.log(response.data);
        const data = response.data;
        setUsecase(data.usecases);
        setStages(response.data.stages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* bg-gray-200 border */}
      <main className=" h-[100%] bg-gray-200 border w-full  ">
        <div className="ProcurWrongFlex">
          <div className="ProcurWrkFlwTxt">Procurement workflow</div>
        </div>
        {/* Top bar UseCase */}
        <section className="TopBarMainSectionFlex ">
          <p className="UseCasesTxt">UseCases</p>
          <div className="BtnSearchFlexLeft">
            <div className="SearchTxtSearchBarFlex">
              <input
                className="SearchTxt ml-2 border border-neutral-500 "
                type="text"
                placeholder="Search text"
              />
              <span>
                <button className="UseCaseBtnClr">
                  <Image src={Search} alt="#" />
                </button>
              </span>
            </div>
            <button className="ResoucesViewBtn">Action</button>
          </div>
        </section>

        {/* Requiment Mock Development  actual component  CD/Ci test  Stage/Release */}
        <section className=" flex h-[100%] flex-row justify-start gap-3 p-3 overflow-x-scroll items-start">
          {/* Requirement section */}
          {stages.map((stage, index) => {
            // Filter usecases for the specific stage
            const stageUsecases = usecase.filter(
              (usecase) => usecase.current_stage === stage
            );
            return (
              <div
                key={index}
                className=" bg-blue-50 flex flex-col px-3 py-3  items-center justify-center  "
              >
                <div className="pb-3 W-[100%] flex flex-row w-64 justify-center ">
                  <p className="RequirementText">{stage}</p>
                </div>
                {stageUsecases.length > 0 ? (
                  <div>
                    {stageUsecases.map((usecases, index) => (
                      <div
                        key={index}
                        className="bg-white border h-[100%] rounded-lg p-3 leading-4 gap-3"
                      >
                        <p className="UseCaseTxt">{usecases.usecase_name}</p>
                        <div className=" flex flex-row justify-start items-center gap-2">
                          <div>
                            <div className="flex flex-row justify-between">
                              <p className="AssignedColTxtUsecaseComp">
                                Assigned to
                              </p>
                              <p className="NameProfileColUsecaseComp ">
                                {usecases.assignee_name}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="AssignedColTxtUsecaseComp">
                                No. of Resources:
                              </p>
                              <p className="NameProfileColUsecaseComp">
                                {usecases.total_resources}
                              </p>
                            </div>
                            <div className="flex">
                              <p className="AssignedColTxtUsecaseComp">
                                Dates:
                              </p>
                              <p className="NameProfileColUsecaseCompDate ">
                                {usecases.end_date}
                              </p>
                            </div>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
