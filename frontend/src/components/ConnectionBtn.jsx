import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { userContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:4000");

function ConnectionBtn({ userId }) {
  const { userData } = useContext(userContext);
  const { serverUrl } = useContext(authContext);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const sendCon = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/connection/send/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      setStatus("pending")
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const removeCon = async () => {
    try {
      const result = await axios.delete(
        `${serverUrl}/api/connection/remove/${userId}`,
        {
          withCredentials: true,
        }
      );
      setStatus("+conncet")
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const getConStatus = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection/getstatus/${userId}`,
        {
          withCredentials: true,
        }
      );
      setStatus(result.data.data.status);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!userData?._id || !userId) return;

    socket.emit("register", userData._id);

    getConStatus();

    const handleStatusUpdate = ({ updateduserId, newStatus }) => {
      if (updateduserId === userId) {
        setStatus(newStatus);
      }
    };

    socket.on("statusUpdate", handleStatusUpdate);

    return () => {
      socket.off("statusUpdate", handleStatusUpdate);
    };
  }, [userId, userData?._id]);

  const handleClick = async () => {
    if (status === "disconnect") {
      await removeCon();
    } else if (status === "received") {
      navigate("/network");
    } else if (status === "+connect") {
      await sendCon();
    }
  };

  return (
    <button
      className="flex justify-center items-center text-[#0a66c2] font-semibold text-sm hover:bg-blue-50 px-2 py-1 rounded-full transition-colors disabled:opacity-50"
      onClick={handleClick}
      disabled={!status || status === "pending"}
    >
      {status || "Loading..."}
    </button>
  );
}

export default ConnectionBtn;