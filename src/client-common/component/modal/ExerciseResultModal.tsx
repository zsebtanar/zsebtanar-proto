import * as React from 'react'
import { Button } from '../general/Button'

export function ExerciseResultModal(props) {
  return (
    <div className={`modal-dialog`} role="document">
      <div className="modal-content">
        <div className="modal-body">
          {props.success ? (
            <div>
              <div className="alert alert-success text-center">
                <i className="fa fa-check fa-lg" /> A megoldás helyes. Gratuláunk!
              </div>
              <hr />
              <Button
                className="btn btn-secondary btn-lg btn-block"
                onAction={() => props.close('back')}
              >
                <i className="fa fa-chevron-left" /> Vissza a feladatok listához
              </Button>
            </div>
          ) : (
            <div>
              <div className="alert alert-warning text-center">
                Sajnos rossz választ adtál meg. <br /> Próbáld meg újra!
              </div>
              <hr />
              <Button
                className="btn btn-primary btn-lg btn-block"
                onAction={() => props.close('retry')}
              >
                <i className="fa fa-repeat" /> Újra próbálom
              </Button>
              <Button
                className="btn btn-secondary btn-lg btn-block"
                onAction={() => props.close('back')}
              >
                <i className="fa fa-chevron-left" /> Vissza a feladatok listához
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// default export for dynamic import
export default ExerciseResultModal