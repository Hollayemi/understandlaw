import { useContext } from "react";
import { DataContext }       from "../context/userContext";


export const useUserData  = () => useContext(DataContext);