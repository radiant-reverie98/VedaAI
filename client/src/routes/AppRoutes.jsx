import React from 'react'
import { Routes, Route } from 'react-router-dom'

import DashboardLayout from '../layout/DashboardLayout'

import Home from '../components/dashboard/Home'
import Assignment from '../components/dashboard/Assignment'
import AITeacher from '../components/dashboard/AITeacher'
import Library from '../components/dashboard/Library'
import MyGroups from '../components/dashboard/MyGroups'
import CreateAssignment from '../components/dashboard/CreateAssignment'
import { LogIn } from 'lucide-react'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AssignmentDetails from '../components/dashboard/AssignmentDetails'

function AppRoutes() {
  return (
    <Routes>

      <Route path="/dashboard" element={<DashboardLayout />}>

        <Route path="home" element={<Home />} />
        <Route path="assignment" element={<Assignment />} />
        <Route path="ai-teacher" element={<AITeacher />} />
        <Route path="library" element={<Library />} />
        <Route path="my-groups" element={<MyGroups />} />
        <Route path="create-assignment" element={<CreateAssignment/>}/>
        <Route path="assignment/:assignmentId" element={<AssignmentDetails />} />


      </Route>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>

    </Routes>
  )
}

export default AppRoutes