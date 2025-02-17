"use client";
import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Modal, Tabs, Upload, notification, Dropdown, Space, Button, Menu, Typography, Skeleton } from "antd";
import {
  BugOutlined,
  CaretDownOutlined,
  DownOutlined,
  FileProtectOutlined,
  LinkOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  BarsOutlined,
  ShoppingOutlined,
  RiseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { data } from "autoprefixer";
import Image from "next/image";
import userImg from "../../../public/assets/user.png";
// import { axios } from 'axios';

//Doc upload//
import { Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";
import Item from "antd/es/list/Item";
// import user from "../../../public/assets/icons8-user.gif"
import user from "../../../public/assets/icons8-user-48.png"
const { Dragger } = Upload;
//Doc upload//

const RequirementForm = (stepperState) => {
  const [size, setSize] = useState("small");
  console.log("propsValue", stepperState);

  const onChange = (e) => {
    setSize(e.target.value);
  };
  const arrayOfObjects = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
    { id: 3, name: "Doe" },
  ];

  const [requireData, setRequireData] = useState();
  const [formatedDate, setformatedDate] = useState();
  const [requiretasks, setrequireTasks] = useState([]);
  const [requireChecklist, setrequireChecklist] = useState();
  const setUsecaseId = useSelector((state) => state.addUsecase);
  const UsecaseId = setUsecaseId.useCaseId;
  const [loading, setLoading] = useState(true);

  const [RolesDetails, setRolesDetails] = useState();
  const [Roles, setRoles] = useState();
  const [teamData, setTeamData] = useState([]);
  const setprojectIds = useSelector((state) => state.addResources);
  const projectId = setprojectIds.id[0].prjectId;
  console.log(UsecaseId);
  useEffect(() => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://spj7xgf470.execute-api.us-east-1.amazonaws.com/dev/usecase/${UsecaseId}/task`,
      headers: {
        Accept: "application/json",
      },
    };
    setLoading(true); // Set loading state to true when fetching data

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        console.log(response.data);

        console.log(JSON.stringify(response.data.stages));
        // setRequireData(response.data);
        const stages = response.data.stages;
        console.log(stages);
        const propsValue = Object.values(stepperState)[0];
        // const creationDate = new Date(requireData.usecase.creation_date);
        // const formattedDate = creationDate.toISOString().slice(0, 10); // YYYY-MM-DD format
        // setformatedDate(formattedDate);
        const stage = stages.filter(
          (obj) => Object.values(stepperState)[0] in obj
        );
        const tasks = stage[0][propsValue].tasks;
        const Docs = tasks.docs;
        console.log(tasks);
        console.log(Docs);
        const checkList = stage[0][propsValue].checklist;
        // console.log("tassks", tasks);
        // console.log("checklist", checkList);
        setrequireTasks(tasks);
        // window.addEventListener("load", () => {
        //   const storedCurrentTask = localStorage.getItem("currentTask");
        //   if (storedCurrentTask) {
        //     const parsedCurrentTask = JSON.parse(storedCurrentTask);
        //     setrequireTasks(parsedCurrentTask);
        //   }
        // });

        setrequireChecklist(checkList);
        // console.log(tasks);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://spj7xgf470.execute-api.us-east-1.amazonaws.com/dev/project/${projectId}/team`
        );
        const responseData = response.data;
        console.log("responsedata ", responseData);
        console.log(JSON.stringify(responseData));
        const data = response.data;
        setRolesDetails(data.map((obj) => Object.values(obj)));
        setRoles(data.map((obj) => Object.keys(obj)));
        setTeamData(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [UsecaseId, stepperState, projectId]);
  console.log(Roles);

  console.log("teamData", teamData);
  console.log("teamDetails", RolesDetails);
  console.log(requiretasks);

  const InsideDropDown = ({ name }) => {
    const [visible, setVisible] = useState(false);

    const items = [
      { key: "1", label: "Item 1" },
      { key: "2", label: "Item 2" },
      { key: "3", label: "Item 3" },
    ];

    const handleVisibleChange = (flag) => {
      setVisible(flag);
    };

    const handleButtonClick = () => {
      // Handle button click action here
    };

    return (
      <Dropdown
        visible={visible}
        onVisibleChange={handleVisibleChange}
        overlay={
          <Space direction="vertical">
            {items.map((item) => (
              <Button key={item.key} type="text">
                {item.label}
              </Button>
            ))}
          </Space>
        }
      >
        <Typography.Link onClick={(e) => e.preventDefault()}>
          <Space>
            {name}
            <DownOutlined />
          </Space>
        </Typography.Link>
        {visible && (
          <Button type="primary" onClick={handleButtonClick}>
            Action
          </Button>
        )}
      </Dropdown>
    );
  };
  let items = [];
  if (Roles) {
    items = Roles.map((data, index) => ({
      label: data,
      items: ["Resource 1", "Resource 2", "Resource 3"],
    }));
  }

  //////////---------------- Doc upload starts here
  const [image, setimage] = useState([]);
  const [fileuploaded, setfileuploaded] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);
  const [convertedImagesString, setconvertedImagesString] = useState("");
  const [convertedLinkString, setconvertedLinkString] = useState("");
  const [Attachments, setAttachments] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  console.log(Attachments);
  const handleFileChange = (info) => {
    const allFiles = info.fileList;
    const imgarray = allFiles.map((e) => e.originFileObj);
    setfileuploaded(true);
    setUploadingFiles(allFiles);
    convertImagesToBase64(imgarray);
  };

  const convertImagesToBase64 = async (images) => {
    const newConvertedImages = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      if (file) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newConvertedImages.push({ fileName: file.name, data: base64 });
      }
    }
    setConvertedImages(newConvertedImages);
  };
  let accesstoken =
    "eyJraWQiOiJ0WExXYzd1ZGhyaVwvVEhLYldwK3F2bEw4SGtJTXQwZVBhUmlzQXhCd0lwRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjNGI4YjRhOC05MDExLTcwMmUtOTY2ZC1lZDQ3NmUzODY5ZDciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfSlA1QjRXWGJIIiwiY3VzdG9tOnVzZXJfaWQiOiI2NDY4ZjIzNi02NmM4LTRlMjItYWVlYS0xMDA0YjE0YzVjMjkiLCJjdXN0b206b3JnX2lkIjoiYjk0YTU2NGQtODlmNy00NmQxLWJkNDEtYzZmNzQwMzQ5N2JjIiwiY29nbml0bzp1c2VybmFtZSI6ImM0YjhiNGE4LTkwMTEtNzAyZS05NjZkLWVkNDc2ZTM4NjlkNyIsIm9yaWdpbl9qdGkiOiI4MWNhZTliNC00NmQ3LTRlNzQtOGM4NS0zOGNhMWM0MDZhOTMiLCJhdWQiOiI3OXFhMDR1bXY1bzFoc2tvajVmcXRkMnM4cCIsImV2ZW50X2lkIjoiYjliMjkwZTktZDBlNi00MDdlLWFiYmItMTk0MDdjN2MyZDUzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTEwNzk2MDAsImV4cCI6MTcxMTE2NjAwMCwiY3VzdG9tOnJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMTA3OTYwMCwianRpIjoiOGI4YzU3ZTAtOWFiMi00OTNhLThlOWUtYmUwMDhiY2UyNDc3IiwiZW1haWwiOiJpdHphbHRhZmh1c2FpbkBnbWFpbC5jb20ifQ.hZt3B30zbhANvIyAzVC8VdsTSFHTZALtQBINapFjU1ezJ2YHNDc6WuYxgXP0QfPjK3pONgWf_iR3Wgf0rFHner602HNmcFCbGpMUbkE-et8-Q1irRkF-RbYR9ErNpkKtJdWZbghDvkrPQmaAIgwxvNJSO56Dx67Vlma9d80J4rEV4X_Sj7_MQhm097tZKUNkL0LgEdQ-wATR9ZlMlKWeUVL3AHD4oIXYbTB6hbXHjDFwxtsr8L9Jka-byWVcK0bbejwTMicGEhdCN5WEAZiCOjrxpHD6dSD8nA7Ju6n9EQiuW4mXSG1F4wNu515PTgTJDFRQ47Ou12sMRaZS0ZEnsA";
  const uploadingImages = async () => {
    const newAttachments = [];
    for (let i = 0; i < convertedImages.length; i++) {
      try {
        const response = await axios.post(
          "https://i3mdnxvgrf.execute-api.us-east-1.amazonaws.com/dev/docUpload",
          convertedImages[i],
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
          }
        );
        newAttachments.push(response.data.link);
        setconvertedImagesString(response.data.link);
      } catch (error) {
        console.error(error);
        alert("Error uploading image. Please try again.");
      }
    }
    setAttachments([...newAttachments]);
    setConvertedImages([]); // Reset convertedImages after upload
    setUploadingFiles([]); // Clear uploading files after upload
  };

  useEffect(() => {
    if (fileuploaded && convertedImages.length > 0) {
      uploadingImages();
      setfileuploaded(false);
    }
  }, [fileuploaded, convertedImages]);

  const getFileNameFromUrl = (url) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  const UploadDocs = () => (
    <Dragger
      multiple
      onChange={(e) => {
        handleFileChange(e);
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
  console.log(convertedImagesString);

  /////////--------------  Doc upload ends

  //////---------------Doc Link

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [linkUpload, setlinkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const inputName = (e) => {
    setName(e.target.value);
  };

  const inputLink = (e) => {
    setLink(e.target.value);
  };

  const handleSubmit = async () => {
    if (!link) {
      console.log("No link provided");
      return;
    }

    try {
      // Fetch the image from the provided URL
      const response = await fetch(link);
      const response1 = response.url;
      console.log(response1);
      console.log(response);
      const blob = await response.blob();

      // Convert the blob to base64
      const base64 = await blobToBase64(blob);

      // Prepare data to send to API

      const newAttachments = [];
      const request = {
        // name: name,
        fileName: name,
        data: base64,
      };

      // Send data to API
      const apiResponse = await axios.post(
        "https://i3mdnxvgrf.execute-api.us-east-1.amazonaws.com/dev/docUpload",
        request,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accesstoken}`,
          },
        }
      );

      // Handle API response
      console.log(apiResponse.data);
      setconvertedLinkString(apiResponse.data.link);
      newAttachments.push(apiResponse.data.link);
      setAttachments([...Attachments, ...newAttachments]);
      setConvertedImages([]); // Reset convertedImages after upload
      setUploadingFiles([]); // Clear uploading files after upload
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };


  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        //   if (reader.result) {
        resolve(reader.result);
        //   } else {
        //     reject(new Error('Error reading Blob'));
        //   }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  //////---------------Doc Link End

  const [DocumentAssign, setDocumentAssign] = useState({
    doc_name: "",
  });

  const handleChange = (e) => {
    // Update the project state as the user types
    setDocumentAssign({ ...DocumentAssign, [e.target.name]: e.target.value });
    console.log(DocumentAssign);
  };
  //------------Docs Post
  const UploadingDoc = () => {
    const currentTask = requiretasks.at(AssignIndex);
    // console.log("Docs", currentTask)
    (currentTask.docs[0] = {
      doc_name: DocumentAssign.doc_name,
      doc_url: convertedImagesString,
    }),

      console.log("Docs", currentTask);
    // handleAssignButtonClick(AssignResourseId);
    HandleUploadingDoc(), handleCancel();
  };
  const UploadingLink = () => {
    const currentTask = requiretasks.at(AssignIndex);
    // console.log("Docs", currentTask)
    (currentTask.docs[0] = {
      link_name: name,
      link_url: convertedLinkString,
    }),

      console.log("Docs", currentTask);
    // handleAssignButtonClick(AssignResourseId);
    HandleUploadingLink(), handleCancel();
  };

  const HandleUploadingDoc = async () => {
    let data = JSON.stringify({
      doc_name: DocumentAssign.doc_name,
      doc_url: convertedImagesString,
    });
    console.log("request :", data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://spj7xgf470.execute-api.us-east-1.amazonaws.com/dev/task/${TaskId}/doc`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /////-----HandelLinkUpload
  const HandleUploadingLink = async () => {
    let data = JSON.stringify({
      doc_name: name,
      doc_url: convertedLinkString
    });
    console.log("request :", data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://spj7xgf470.execute-api.us-east-1.amazonaws.com/dev/task/${TaskId}/doc`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const axios = require('axios');

  ///------------Docs Post

  const [isOpen, setIsOpen] = useState(false);
  const [openItemIndex, setOpenItemIndex] = useState(null);
  const [openActionIndex, setopenActionIndex] = useState(null);
  const [openImageIndex, setopenImageIndex] = useState([]);
  const dropdownRef = useRef(null);
  const closedropdownRef = useRef(null);
  const [showOptions, setShowOptions] = useState(
    requiretasks ? Array(requiretasks.length).fill(false) : []
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState();
  const [selectedAssign, setSelectedAssign] = useState();
  const [selectedAssignName, setSelectedAssignName] = useState();
  const [AssignName, setAssignName] = useState();
  const [AssignIndex, setAssignIndex] = useState();
  const [AssignDocs, setAssignDocs] = useState();
  const [AssignImg, setAssignImg] = useState();
  const [AssignResourseId, setAssignResurseId] = useState();
  const [TaskId, setTaskId] = useState();
  const [AssigneeImg, setAssigneeImg] = useState(null);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for main dropdown

  // console.log(AssignName, AssignIndex);


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".relative.flex")
      ) {
        setOpenItemIndex(null);
        // setIsDropdownOpen(false);
      }
    }

    if (openItemIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openItemIndex, dropdownRef]);

  // action button
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        closedropdownRef.current &&
        !closedropdownRef.current.contains(event.target) &&
        !event.target.closest(".relative")
      ) {
        setopenActionIndex(null);
      }
    }

    if (openActionIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionIndex]);

  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement: placement,
    });
  };

  const toggleSaved = (index) => {
    setopenImageIndex((prevIndexes) => {
      const currentIndex = prevIndexes.indexOf(index);
      if (currentIndex === -1) {
        return [...prevIndexes, index];
      } else {
        return prevIndexes.filter((i) => i !== index);
      }
    });
  };

  const toggleOptions = (index) => {
    const newShowOptions = [...showOptions];
    newShowOptions[index] = !newShowOptions[index];
    setShowOptions(newShowOptions);
    // setopenActionIndex(openActionIndex === index ? null : index);

    setopenActionIndex(index);
  };
  const handleOptionClick = () => {
    setShowUploadModal(true);
  };
  const handleCancel = () => {
    setShowUploadModal(false);
    setIsModalOpen(false);
  };
  const toggleDropDown = (index) => {
    setIsOpen(!isOpen);
  };

  const toggleSubItems = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
    // setIsDropdownOpen(!isDropdownOpen);
  };
  const handleSubItemClick = (subItem) => {
    setSelectedSubItem(subItem);
  };
  console.log("selectedResource", selectedAssignee);

  const handleTaskId = (taskId) => {
    setTaskId(taskId);
    console.log("selectedTaskId", taskId);
  };
  const handleAssigneName = (name) => {
    setSelectedAssignName(name);
  };
  const assigndbutton = () => {
    const currentTask = requiretasks.at(AssignIndex);
    (currentTask.assigned_to.Id = AssignResourseId),
      (currentTask.assigned_to.name = AssignName),
      (currentTask.assigned_to.image = AssignImg);
    handleAssignButtonClick(AssignResourseId);
    setOpenItemIndex(null);
  };

  const handleAssignButtonClick = (id) => {
    console.log("Selected SubItem:", id);

    const axios = require("axios");

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `https://spj7xgf470.execute-api.us-east-1.amazonaws.com/dev/task/${TaskId}/assign/${id}`,
      headers: {
        Accept: "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        openNotification("topRight", "success", `${response.data.message}`);
        console.log("resporns Datar", response.data);
        const currentTask = requiretasks.at(AssignIndex);
        (currentTask.assigneId = AssignResourseId),
          (currentTask.assigneName = AssignName),
          (currentTask.assigne_image = AssignImg);
        requiretasks[AssignIndex] = currentTask;
        console.log(config);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const actionButtons = document.querySelectorAll('.action-button');
  // console.log("requiredData:", requireData.usecase.stages  )
  return (
    <div>
      {loading ? (
        <p>
          {" "}
          <Skeleton
            active
            paragraph={{
              rows: 6,
            }}
          />
        </p>
      ) : (
        <>
          {requiretasks.map(
            (data, index) => (
              console.log("taskData", data),
              (
                <div className="mb-8" key={index}>
                  <div
                    className="flex items-center justify-between py-3 px-2"
                    style={{ background: "rgba(230, 247, 255, 1)" }}
                  >
                    <h1 className="text-base font-bold leading-tight tracking-normal text-left">
                      {data.name}
                    </h1>
                    <DownOutlined />
                  </div>
                  <div
                    className="flex items-center justify-between mt-2 px-4"
                    key={index}
                  >
                    <div
                      ref={dropdownRef}
                      className="relative flex items-center gap-4"
                    >
                      <button
                        onClick={() => toggleSubItems(index)}
                        className="bg-white border text-black p-2 rounded-md flex items-center gap-1 "
                      >
                        Assign
                        <img
                          width="15"
                          src="https://img.icons8.com/ios/50/expand-arrow--v2.png"
                          alt="expand-arrow--v2"
                        />
                      </button>
                      {loading ? (
                        <p></p>
                      ) : (
                        <div className="flex gap-2 w-[2]" id="AssigneeImg">
                          <h5>{data.assigned_to.name}</h5>
                          {/* <Image
                            src={data.assigned_to.image}
                            alt={data.assigned_to.name}
                            height={34}
                            width={34}
                          ></Image> */}
                          {data.docs &&
                            data.docs.length > 0 &&
                            data.docs.map((doc, index) => (
                              <div key={index}>
                                <Image
                                  src={doc.doc_url}
                                  alt={doc.doc_name}
                                  height={34}
                                  width={30}
                                />
                                <a href={doc.doc_url} target="_blank">{doc.doc_name}</a>
                              </div>
                            ))}

                          {/* {AssignDocs === data.id && ( */}
                        </div>
                      )}

                      {openItemIndex === index && showOptions && (
                        <ul className="absolute top-10 left-0 bg-white text-black shadow-md rounded-md z-[2]">
                          <div className="flex items-center justify-center">
                            <SearchOutlined className="pl-2" />
                            <input
                              type="text"
                              placeholder="Search Role"
                              className="outline-none ml-2"
                            />
                          </div>
                          {teamData.map(
                            (itemsData, itemIndex) => (
                              console.log(itemsData),
                              (
                                <li key={itemIndex} className="p-2">
                                  <div className="flex items-center justify-between">
                                    {Object.keys(itemsData).map(
                                      (key, inx) => (
                                        console.log(key),
                                        (
                                          <button
                                            key={inx}
                                            onClick={() =>
                                              handleSubItemClick(
                                                itemIndex === selectedSubItem
                                                  ? null
                                                  : itemIndex
                                              )
                                            }
                                            className="font-semibold"
                                          >
                                            {key}
                                          </button>
                                        )
                                      )
                                    )}
                                    <CaretDownOutlined />
                                  </div>
                                  {selectedSubItem === itemIndex &&
                                    itemsData && (
                                      <ul>
                                        <li className=" ">
                                          {Object.values(itemsData).map(
                                            (subItem, i) => (
                                              <React.Fragment key={i}>
                                                {Array.isArray(subItem) &&
                                                  subItem.map(
                                                    (item, j) => (
                                                      console.log(
                                                        item.resource_id
                                                      ),
                                                      (
                                                        <button
                                                          key={j}
                                                          className="py-1 w-[100%]"
                                                          style={{
                                                            backgroundColor:
                                                              selectedAssign ===
                                                                item.resource_id // Assuming selectedSubItem is the selected name
                                                                ? "#E6F7FF"
                                                                : "transparent",
                                                          }}
                                                          onClick={() => {
                                                            setAssignIndex(
                                                              index
                                                            );
                                                            setAssignResurseId(
                                                              item.resource_id
                                                            ),
                                                              setAssignName(
                                                                item.name
                                                              ),
                                                              setAssignImg(
                                                                items.image_url
                                                              );

                                                            handleTaskId(
                                                              data.id
                                                            );
                                                            // handleSelectedResourse(
                                                            //   item.resource_id
                                                            // );

                                                            handleAssigneName(
                                                              item.name
                                                            );
                                                            setSelectedAssign(
                                                              item.resource_id
                                                            );
                                                          }}
                                                        >
                                                          {item.name}
                                                          {/* Assuming name is the property to be displayed */}
                                                        </button>
                                                      )
                                                    )
                                                  )}
                                              </React.Fragment>
                                            )
                                          )}
                                        </li>
                                        <button
                                          onClick={() => {
                                            // handleAssignButtonClick(
                                            //   selectedAssign
                                            // );
                                            assigndbutton();
                                            handleSubItemClick(
                                              itemIndex === selectedSubItem
                                                ? null
                                                : itemIndex
                                            );
                                            toggleSaved(index);
                                            // setIsDropdownOpen(false)
                                          }}
                                          style={{
                                            backgroundColor: '#4299e1',
                                            padding: '0.5rem 0.75rem',
                                            color: '#ffffff',
                                            borderRadius: '0.375rem',
                                          }}
                                        // className="action-button bg-sky-500 px-2 py-1 text-white rounded-sm  "
                                        >
                                          Assign
                                        </button>
                                      </ul>
                                    )}
                                </li>
                              )
                            )
                          )}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <MessageOutlined style={{ fontSize: "20px" }} />
                      <div className="relative" ref={closedropdownRef}>
                        <button
                          onClick={() => {
                            toggleOptions(index), setAssignIndex(index);
                            setAssignDocs(data.id);
                            handleTaskId(data.id);

                            console.log("selected TaskId", data.id);
                          }}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold p-2 rounded"
                        >
                          Action
                        </button>

                        {openActionIndex === index && (
                          <div className=" cursor-pointer absolute z-10 bg-white w-[10rem] p-2 -left-[50%] rounded-lg shadow-lg overflow-hidden">
                            <ul>
                              <li onClick={handleOptionClick}>
                                <FileProtectOutlined /> Upload Document
                              </li>
                              <li onClick={showModal}>
                                <LinkOutlined /> Upload Link
                              </li>
                              <li onClick={handleOptionClick}>
                                <BugOutlined /> Raise Issue
                              </li>
                            </ul>
                          </div>
                        )}

                        <Modal
                          title="Upload Document"
                          visible={showUploadModal}
                          onCancel={handleCancel}
                          footer={null}
                        >
                          {/* <Upload > */}
                          {/* <Button icon={<UploadOutlined />}>
                                  Upload
                                </Button> */}
                          {/* </Upload> */}
                          <UploadDocs />
                          <Form.Item
                            className="flex items-center ml-4 mt-2 "
                            name={["doc_name"]}
                            label="Enter Document Name"
                            rules={[
                              {
                                message: "Please input the Document Name!",
                              },
                            ]}
                          >
                            <Input
                              name="doc_name"
                              id="DocsName"
                              value={DocumentAssign.doc_name}
                              className="h-6"
                              onChange={handleChange}
                            />
                          </Form.Item>
                          <Button
                            className="mt-1"
                            onClick={() => {
                              UploadingDoc();
                            }}
                          >
                            Upload
                          </Button>
                        </Modal>

                        <Modal
                          title="Document Upload"
                          open={isModalOpen}
                          onOk={() => {
                            handleOk(), handleSubmit();
                            UploadingLink()
                          }}
                          onCancel={handleCancel}
                        >
                          <div className="flex flex-col gap-4">
                            <input

                              onChange={(e) => {
                                inputName(e);
                              }}
                              className="p-2 border rounded "
                              placeholder="Enter Name"
                            ></input>
                            <div className="flex w-full ">
                              <button className="mr-2 border rounded p-2">
                                https://
                              </button>
                              <input
                                onChange={(e) => {
                                  inputLink(e);

                                }}
                                className="p-2 border rounded  w-full"
                                placeholder="Paste link here "
                              ></input>
                            </div>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          )}

          <div className="mt-6 border ">
            <h2 className="text-l font-medium p-2">
              Checklist for requirement
            </h2>
            {requireChecklist.map((checklistdata, index) => (
              <div className="px-4 py-2 flex items-center gap-2 " key={index}>
                <input type="checkbox"></input>
                <p>{checklistdata.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RequirementForm;