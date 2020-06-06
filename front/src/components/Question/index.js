// Libs
import React from 'react'
import _ from 'lodash'
import { ArrowRight } from 'react-feather'

// Styles
import "./styles.less"

// Containers or components
import Button from '../../components/Button'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Radio from '../../components/Radio'

const Question = ({ number, question, length, handleNext, handlePrevious, handleChange, handleCreate, handleCancel, ...props }) => {
  let component
  let children
  let childIndex = 1
  switch (question.type) {
    case "radio":
      component = (
        <Radio
          value={question.answer}
          options={question.children.filter(item => item.option !== '')}
          onChange={value => handleChange(value)} />
      )
      children = question.children.filter(item => item.option && item.option === question.answer)

      if(!_.isEmpty(children)) {
        children = children[0]
        childIndex = children.childIndex
      }
      break;
    case "textarea":
      component = (
        <Textarea
          value={question.answer}
          placeholder="Resposta"
          onChange={e => handleChange(e.target.value)} />
      )
      children = question.children[0]
      childIndex = question.childIndex
      break;
    default:
      component = (
        <Input
          value={question.answer}
          placeholder="Resposta"
          onChange={e => handleChange(e.target.value)} />
      )
      children = question.children[0]
      childIndex = question.childIndex
  }

  return (
    <div className="question">
      <h3>Pergunta {number}</h3>
      <h1>{question.value}</h1>
      {component}
      {childIndex &&
        <Button
          disabled={!question.answer}
          onClick={() => handleNext(childIndex)}>
          Continuar
          <ArrowRight size={20}/>
        </Button>
      }
      {!childIndex &&
        <Button
          disabled={!question.answer}
          onClick={handleCreate}>Criar
        </Button>
      }
      {number !== 1 &&
        <p className="question__previous" onClick={() => handlePrevious(question.parentIndex)}>Voltar</p>
      }
      <Button
        className="button--secondary"
        onClick={handleCancel}>Cancelar
      </Button>
    </div>
  )
}

export default Question
