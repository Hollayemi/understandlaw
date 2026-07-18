'use client'
import { useUserData } from "@/hook/useData"
import { CitizenFull } from "@/redux/types"
import LawyerConsultationsPage from "../lawyer/page"
import CitizenConsultationsPage from "./citizen/page"

const Consultation = () => {
    const  {userInfo} = useUserData() as any
    console.log({userInfo})
    return userInfo.user?.role === "lawyer" ? <LawyerConsultationsPage /> : <CitizenConsultationsPage />
}

export default Consultation