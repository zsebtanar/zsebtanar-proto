import React from 'react'
import { UCBinaryChoice } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Select } from 'client/generic/components/form/input/Select'

export function BinaryChoiceAdmin(bindProps: UseModelProps<UCBinaryChoice>): JSX.Element {
  const { bind, data, append, remove } = useModel<UCBinaryChoice>(bindProps)

  return (
    <div className="user-control uc-binary-choice uc-binary-choice-admin">
      <UserControlNameInput {...bind('name')} />
      <div>
        <Checkbox {...bind('isDynamic')} disabled>
          Dinamikus
        </Checkbox>
      </div>

      <hr />

      <div>
        <Checkbox {...bind('props.randomOrder')} disabled>
          Kitöltéskor az állítások véletlenszerű sorredben jelenjenek meg
        </Checkbox>
      </div>

      <hr />

      <h6>
        {' '}
        Megoldások{' '}
        <Button
          btn="link"
          small
          onAction={() => {
            append('props.options', '')
            append('solution', '')
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} /> Alternatív megoldás megadása
        </Button>
      </h6>
      <ol>
        {data.props?.options?.map((item, idx) => (
          <li key={idx}>
            <div className="d-flex">
              <TextEditor
                {...bind(`props.options.${idx}.statement`)}
                preview={MarkdownWithScript}
              />
              <TextEditor
                {...bind(`props.options.${idx}.trueLabel`)}
                preview={MarkdownWithScript}
              />
              <TextEditor
                {...bind(`props.options.${idx}.falseLabel`)}
                preview={MarkdownWithScript}
              />
              <Select
                options={[
                  { label: item.trueLabel, value: true },
                  { label: item.falseLabel, value: false },
                ]}
                {...bind(`solution.${idx}`)}
              />
              <Button
                small
                btn="link"
                className="text-danger"
                onAction={() => {
                  remove(`props.options.${idx}`)
                  remove(`solution.${idx}`)
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
