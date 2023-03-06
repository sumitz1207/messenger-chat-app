import React from 'react'

const Repo = (props) => {
  return (
    <ul>
      <li>Repo name: {props.repo.name}</li>
      <li>Username: {props.repo.username}</li>
      <li>Watchers: {props.repo.watchers}</li>
      <li>Forks: {props.repo.forks}</li>
      <li>
        <div>
          URL: <a href={props.repo.url} target="__blank">Repo link</a>
        </div>
      </li>
    </ul>
  )
 }
export default Repo;