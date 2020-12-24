import * as React from 'react'
import { NavLink } from 'react-router-dom'

function RewardCard(props) {
  //https://www.flaticon.com/free-icon/trophy_420105
  const { id, name, dateOfAchieving, description } = props
  const imageURL = props.userOwns
    ? '/assets/images/trophy-filled.svg'
    : '/assets/images/trophy-empty.svg'
  return (
    <div className="card m-1" style={{ width: '250px' }}>
      <img src={imageURL} className="card-img-top p-2" alt="trófea" width="120px" height="120px" />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{dateOfAchieving}</h6>
        <p className="card-text">{description}</p>
        <NavLink to={`/reward/${id}`} className="card-link">
          Részletek
        </NavLink>
      </div>
    </div>
  )
}

export default RewardCard
