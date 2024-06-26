import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import useSWR from 'swr'

const genderTypes = ['Masculino', 'Feminino', 'Prefiro não responder'] as const
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

const genderSelectValues = [
  { value: genderTypes[0] },
  { value: genderTypes[1] },
  { value: genderTypes[2] }
]

const bloodRadioValues = [
  {
    value: bloodTypes[0]
  },
  {
    value: bloodTypes[1]
  },
  {
    value: bloodTypes[2]
  },
  {
    value: bloodTypes[3]
  },
  {
    value: bloodTypes[4]
  },
  {
    value: bloodTypes[5]
  },
  {
    value: bloodTypes[6]
  },
  {
    value: bloodTypes[7]
  }
]

const formSchema = z.object({
  nome: z
    .string()
    .min(2, {
      message: 'O nome deve ter no mínimo 2 caracteres.'
    })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  genero: z.enum(genderTypes, {
    errorMap: () => ({ message: 'Selecione uma opção de gênero.' })
  }),
  tipoSanguineo: z.enum(bloodTypes, {
    errorMap: () => ({ message: 'Selecione uma opção de tipo sanguíneo.' })
  }),
  termosAceitos: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos.' })
  }),
  dataConsulta: z.coerce
    .date({
      errorMap: () => ({ message: 'Selecione uma data depois de hoje.' })
    })
    .refine((data) => data > new Date(), {
      message: 'Selecione uma data depois de hoje.'
    })
    .transform((data) => data.toISOString().split('T')[0])
})

type FormSchema = z.infer<typeof formSchema>

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json())

export default function Form() {
  const [user, setUser] = useState<FormSchema>()

  const { data: users, error } = useSWR<FormSchema[]>(
    'http://localhost:8080/users',
    fetcher
  )

  async function createUserFetch(user: FormSchema) {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      return response
    } catch (error) {
      console.log(error)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })

  function handleFormSubmit(data: FormSchema) {
    createUserFetch(data)
    setUser(data)
  }

  return (
    <div className="relative flex gap-10">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex w-96 flex-col px-8 py-6 shadow-md"
      >
        <label htmlFor="name" className="block">
          Nome
        </label>
        <input
          type="text"
          id="nome"
          className="mb-4 block w-full border bg-[#eee] p-3 text-base"
          {...register('nome')}
          aria-describedby="nameError"
        />
        {errors.nome && (
          <span id="nameError" className="text-[#f31]">
            {errors.nome.message}
          </span>
        )}

        <label htmlFor="genero">Gênero:</label>
        <select
          className="mb-2 border bg-[#eee] p-3"
          id="genero"
          aria-describedby="selectError"
          {...register('genero')}
        >
          <option value="">Selecione seu Gênero</option>
          {genderSelectValues.map((gender) => (
            <option key={gender.value}>{gender.value}</option>
          ))}
        </select>

        {errors.genero && (
          <span id="selectError" className="text-[#f31]">
            {errors.genero.message}
          </span>
        )}

        <div className="p-3">
          <p>Tipo Sanguíneo</p>
          {bloodRadioValues.map((blood) => (
            <div key={blood.value} className="flex items-center gap-1">
              <input
                type="radio"
                value={blood.value}
                id={blood.value}
                aria-describedby="radioError"
                {...register('tipoSanguineo')}
              />
              <label htmlFor={blood.value}>{blood.value}</label>
            </div>
          ))}
          {errors.tipoSanguineo && (
            <span id="radioError" className="text-[#f31]">
              {errors.tipoSanguineo.message}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <label htmlFor="termo">Aceitar Termos</label>
            <input
              type="checkbox"
              id="termo"
              aria-describedby="checkboxError"
              {...register('termosAceitos')}
            />
          </div>
          {errors.termosAceitos && (
            <span id="checkboxError" className="text-[#f31]">
              {errors.termosAceitos.message}
            </span>
          )}
        </div>
        <input
          className="mt-2"
          type="date"
          id="dataConsulta"
          aria-describedby="dateError"
          {...register('dataConsulta')}
        />
        {errors.dataConsulta && (
          <span id="dateError" className="text-[#f31]">
            {errors.dataConsulta.message}
          </span>
        )}

        <button type="submit" className="mt-4 border bg-gray-300 p-4 text-base">
          Submeter
        </button>
      </form>
      <div className="flex flex-col gap-8">
        <p>Dados enviados:</p>
        {user && (
          <div>
            <p>Nome: {user.nome}</p>
            <p>Genero: {user.genero}</p>
            <p>Tipo Sanguíneo: {user.tipoSanguineo}</p>
            <p>Termos Aceitos: {`${user.termosAceitos ? 'Sim' : 'Não'}`}</p>
            <p>Data da consulta: {user.dataConsulta}</p>
          </div>
        )}
        <div>
          <p>Dados vindos da API:</p>
          {error ? (
            <div>
              <p>Falhou ao carregar os dados</p>
            </div>
          ) : (
            users?.map((user, i) => (
              <div className="mb-2" key={user.nome + i}>
                <ul
                  className="flex flex-col  bg-slate-500 p-3"
                  key={user.nome + i}
                >
                  <li className="text-white">Nome: {user.nome}</li>
                  <li className="text-white">Genero: {user.genero}</li>
                  <li className="text-white">
                    Tipo sanguineo: {user.tipoSanguineo}
                  </li>
                  <li className="text-white">
                    Data da consulta: {user.dataConsulta}
                  </li>
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
