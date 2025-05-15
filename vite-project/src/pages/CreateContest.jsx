import React from 'react'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
function CreateContest() {
    const user = useSelector((state) => state.user.user);
  return (
    <>
    <Navbar/>
    
    </>
  )
}

export default CreateContest
