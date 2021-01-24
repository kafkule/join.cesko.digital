import React, { useState } from 'react'
import { SkillField } from 'services/skillService'
import Strings from '../../../content/onboarding-form.yaml'
import * as S from './styles'

export interface Props {
  skillField: SkillField
  id?: string
  selected: string[]
  handleChange: (id: string) => void
}

const SkillFieldToggle = (props: Props) => {
  const contentRef: React.RefObject<HTMLDivElement> = React.createRef()
  const [toggle, setToggle] = useState<boolean>(false)

  const id = props.id || Math.random().toString(36).substr(2, 7)

  const isSelected = (id: string) => props.selected.indexOf(id) !== -1

  const skills =
    props.skillField.details && props.skillField.details.length
      ? props.skillField.details
      : []

  const Skills = () => (
    <S.SkillsList>
      {skills.map((skill) => (
        <S.SkillsListItem key={skill.id}>
          <S.SkillCheckbox
            id={skill.id}
            label={skill.text}
            onChange={onCheckboxChange}
            checked={isSelected(skill.id)}
          />
        </S.SkillsListItem>
      ))}
    </S.SkillsList>
  )

  const onToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToggle(e.target.checked)
    const element = contentRef.current
    if (element === null) return
    // hide/show content on the transition end
    if (e.target.checked) {
      element.style.display = 'block'
      setTimeout(() => {
        element.style.maxHeight = '1000px'
        element.style.opacity = '1'
      }, 10)
    } else {
      element.style.maxHeight = '0'
      element.style.opacity = '0'
      element.addEventListener(
        'transitionend',
        () => {
          element.style.display = 'none'
        },
        { once: true }
      )
    }
  }

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.handleChange(e.target.id)
  }

  return skills.length ? (
    <>
      <S.ToggleInput type="checkbox" id={id} onChange={onToggleChange} />
      <S.ToggleLabel htmlFor={id}>
        <S.ToggleIcon />
        {props.skillField.skill}
      </S.ToggleLabel>
      {/* TODO: toggle selected skills count */}
      <S.ToggleContent
        aria-hidden={!toggle}
        ref={contentRef}
        style={{ maxHeight: 0, opacity: 0 }}
      >
        <S.ToggleContentContainer>
          <Skills />
          {props.skillField.senior_id && (
            <S.SkillCheckbox
              separated
              id={props.skillField.senior_id}
              label={`${Strings.skills_senior} - ${props.skillField.skill}`}
              onChange={onCheckboxChange}
              checked={isSelected(props.skillField.senior_id)}
            />
          )}
          {props.skillField.mentor_id && (
            <S.SkillCheckbox
              separated
              id={props.skillField.mentor_id}
              label={Strings.skills_mentor}
              onChange={onCheckboxChange}
              checked={isSelected(props.skillField.mentor_id)}
            />
          )}
        </S.ToggleContentContainer>
      </S.ToggleContent>
    </>
  ) : null
}

export default SkillFieldToggle
