import React from "react"
import { Link } from 'react-router-dom'
import './header.style.css'

const Header = () => (
  <div className='header'>
    <Link className='options' to='/'>
      Home
    </Link>
    <Link className='options' to='/recipes' >
      Recipes
    </Link>
    <Link className='options' to='/basic'>
      Basic
    </Link>
  </div>
)

export default Header