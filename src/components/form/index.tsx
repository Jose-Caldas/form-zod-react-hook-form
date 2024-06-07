import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const genderOptions = [
  'Masculino',
  'Feminino',
  'Prefiro não responder'
] as const

const bloodOptions = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+-',
  'O-'
] as const

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
  genero: z.enum(genderOptions, {
    errorMap: () => ({ message: 'Selecione uma opção de gênero.' })
  }),
  tipoSanguineo: z.enum(bloodOptions, {
    errorMap: () => ({ message: 'Selecione uma opção de tipo sanguíneo.' })
  }),
  termosAceitos: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos.' })
  }),
  dataConsulta: z.coerce
    .date({ errorMap: () => ({ message: 'Data inválida.' }) })
    .refine((data) => data > new Date(), { message: 'Data inválida.' })
    .transform((data) => data.toISOString().split('T')[0])
})

type FormSchema = z.infer<typeof formSchema>

export default function Form() {
  const [output, setOutput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })

  function handleFormSubmit(data: FormSchema) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <div className="flex gap-10">
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
        />
        {errors.nome && (
          <span className="text-[#f31]">{errors.nome.message}</span>
        )}

        <p>Gênero:</p>
        <select
          className="mb-2 border bg-[#eee] p-3"
          id="genero"
          {...register('genero')}
        >
          <option value="" hidden>
            Selecione seu Gênero
          </option>
          <option value={genderOptions[0]}>Masculino</option>
          <option value={genderOptions[1]}>Feminino</option>
          <option value={genderOptions[2]}>Prefiro não responder</option>
        </select>

        {errors.genero && (
          <span className="text-[#f31]">{errors.genero.message}</span>
        )}

        <div className="p-3">
          <p>Tipo Sanguíneo</p>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              id="A-"
              value="A-"
              {...register('tipoSanguineo')}
            />
            <label htmlFor="A-">A-</label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              id="B+"
              value="B+"
              {...register('tipoSanguineo')}
            />
            <label htmlFor="B+">B+</label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              id="B-"
              value="B-"
              {...register('tipoSanguineo')}
            />
            <label htmlFor="B-">B-</label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              id="AB+"
              value="AB+"
              {...register('tipoSanguineo')}
            />
            <label htmlFor="AB+">AB+</label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              id="AB-"
              value="AB-"
              {...register('tipoSanguineo')}
            />
            <label htmlFor="AB-">AB-</label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              id="O+"
              value="O+"
              {...register('tipoSanguineo')}
            />
            <label htmlFor="O+">O+</label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              id="O-"
              value="O-"
              {...register('tipoSanguineo')}
            />
            <label htmlFor="O-">O-</label>
          </div>
          {errors.tipoSanguineo && (
            <span className="text-[#f31]">{errors.tipoSanguineo.message}</span>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <label htmlFor="termo">Aceitar Termos</label>
            <input type="checkbox" id="termo" {...register('termosAceitos')} />
          </div>
          {errors.termosAceitos && (
            <span className="text-[#f31]">{errors.termosAceitos.message}</span>
          )}
        </div>
        <input
          className="mt-2"
          type="date"
          id="dataConsulta"
          {...register('dataConsulta')}
        />
        {errors.dataConsulta && (
          <span className="text-[#f31]">{errors.dataConsulta.message}</span>
        )}

        <button type="submit" className="mt-4 border bg-gray-300 p-4 text-base">
          Submeter
        </button>
      </form>
      <pre className="mt-4">
        <p>Payload:</p>
        {output}
      </pre>
    </div>
  )
}
