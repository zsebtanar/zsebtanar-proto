import React from 'react'
import { UCBinaryChoice } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { Button, Checkbox, TextEditor, Select } from 'client/generic/components'
import { MarkdownWithScript } from 'client/script/components'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export function BinaryChoiceAdmin(bindProps: UseModelProps<UCBinaryChoice>) {
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
                resources={{}}
              />
              <TextEditor
                {...bind(`props.options.${idx}.trueLabel`)}
                preview={MarkdownWithScript}
                resources={{}}
              />
              <TextEditor
                {...bind(`props.options.${idx}.falseLabel`)}
                preview={MarkdownWithScript}
                resources={{}}
              />
              <Select
                options={[
                  { label: item.trueLabel, value: true },
                  { label: item.falseLabel, value: false }
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
