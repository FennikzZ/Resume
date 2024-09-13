import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/SignIn";
import { WorkInterface } from "../../interfaces/Work";
import { ResumeInterface } from "../../interfaces/IResume";
import axios from "axios";

const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token") || '';
const Bearer = localStorage.getItem("token_type") || '';

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsers() {
  return await axios
    .get(`${apiUrl}/users`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetWork() {
  return await axios
    .get(`${apiUrl}/works`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPostwork() {
  return await axios
    .get(`${apiUrl}/postworks`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsersById(id: string) {
  return await axios
    .get(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetWorkById(id: string) {
  return await axios
    .get(`${apiUrl}/work/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPostworkById(id: string) {
  return await axios
    .get(`${apiUrl}/postwork/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateUsersById(id: string, data: UsersInterface) {
  return await axios
    .put(`${apiUrl}/user/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateWorkById(id: string, data: WorkInterface) {
  return await axios
    .put(`${apiUrl}/work/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateResumeById(id: string, data: ResumeInterface) {
  return await axios
    .put(`${apiUrl}/resumes/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteUsersById(id: string) {
  return await axios
    .delete(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteWorkById(id: string) {
  return await axios
    .delete(`${apiUrl}/work/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeletePostworkById(id: string) {
  return await axios
    .delete(`${apiUrl}/postwork/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteResumeById(id: string) {
  return await axios
    .delete(`${apiUrl}/resumes/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateWork(data: WorkInterface) {
  return await axios
    .post(`${apiUrl}/works`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateResume(data: ResumeInterface) {
  return await axios
    .post(`${apiUrl}/resumes`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetResume() {
  return await axios
    .get(`${apiUrl}/resumes`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetResumeById(id: string) {
  return await axios
    .get(`${apiUrl}/resumes/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export const GetUserProfile = async (): Promise<any> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(`${apiUrl}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export {
  SignIn,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  GetWork,
  GetWorkById,
  UpdateWorkById,
  DeleteWorkById,
  CreateWork,
  GetPostwork,
  GetPostworkById,
  DeletePostworkById,
  // Resume
  CreateResume,
  GetResume,
  UpdateResumeById, // Added this line
  DeleteResumeById,
  GetResumeById,
};
