import React from 'react'
import { Routes, Route } from 'react-router-dom'

import DashboardLayout from '../layout/DashboardLayout'

import Home from '../components/dashboard/Home'
import Assignment from '../components/dashboard/Assignment'
import AITeacher from '../components/dashboard/AITeacher'
import Library from '../components/dashboard/Library'
import MyGroups from '../components/dashboard/MyGroups'
import CreateAssignment from '../components/dashboard/CreateAssignment'

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


      </Route>

    </Routes>
  )
}

export default AppRoutes