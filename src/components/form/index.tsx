import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  nome: z
    .string()
    .min(2, {
      message: 'O nome deve ter no mínimo 2 caracteres.'
    })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  genero: z.string(),
  tipoSanguineo: z.string({
    message: 'Selecione uma opção de tipo sanguineo.'
  }),
  termosAceitos: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos.' })
  }),
  dataConsulta: z
    .string({
      errorMap: () => ({ message: 'Data Inválida.' })
    })
    .date()
})

type FormSchema = z.infer<typeof formSchema>

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })
  console.log(errors)

  function handleFormSubmit(data: FormSchema) {
    console.log(data)
  }

  return (
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
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="prefiro não responder">Prefiro não responder</option>
      </select>

      <div className="p-3">
        <p>Tipo Sanguíneo</p>
        <div className="flex items-center gap-1">
          <input
            type="radio"
            id="O-"
            value="O-"
            {...register('tipoSanguineo')}
          />
          <label htmlFor="O-">O-</label>
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
            id="B-"
            value="B-"
            {...register('tipoSanguineo')}
          />
          <label htmlFor="B-">B-</label>
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
            id="naoSei"
            value="Não sei"
            {...register('tipoSanguineo')}
          />
          <label htmlFor="naoSei">Não sei</label>
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
        Enviar
      </button>
    </form>
  )
}
