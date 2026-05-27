import { useState, useCallback } from 'react'
import { validatePayment } from '../lib/api'
import { savePago } from '../lib/pagosDb'
import { getBankByCode, getBankConfigs } from '../config/banks'
import type { ValidationForm, ValidationFormErrors, ValidationResult, BDVRequest } from '../types'

const defaultBank = getBankConfigs().find(b => b.active)?.code ?? '0134'

function makeInitialForm(): ValidationForm {
  const bank = getBankByCode(defaultBank)
  return {
    bankCode: defaultBank,
    ref: '',
    amount: '',
    date: '',
    phone: '',
    cedula: '',
    reqCed: bank?.reqCedDefault ?? false,
  }
}

export function useValidation(onSuccess?: (result: ValidationResult) => void) {
  const [form, setForm] = useState<ValidationForm>(makeInitialForm)
  const [errors, setErrors] = useState<ValidationFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const setField = useCallback(<K extends keyof ValidationForm>(field: K, value: ValidationForm[K]) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'bankCode') {
        const cfg = getBankByCode(value as string)
        next.reqCed = cfg?.reqCedDefault ?? false
      }
      return next
    })
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((): ValidationFormErrors => {
    const errs: ValidationFormErrors = {}
    if (!form.ref.trim()) {
      errs.ref = 'Requerido'
    } else if (form.ref.trim().length < 4) {
      errs.ref = 'Mínimo 4 dígitos'
    } else if (form.ref.trim().length > 8) {
      errs.ref = 'Máximo 8 dígitos'
    }
    if (!form.amount.trim()) errs.amount = 'Requerido'
    if (!form.date.trim())   errs.date   = 'Requerido'
    if (!form.cedula.trim()) errs.cedula = 'Requerido'
    // Teléfono es opcional — no se valida como requerido

    const bankCfg = getBankByCode(form.bankCode)
    if (!bankCfg?.telefonoDestino) {
      errs.submit = `No hay teléfono destino configurado para ${bankCfg?.name ?? form.bankCode}. Configúralo en Ajustes.`
    }
    return errs
  }, [form])

  const submit = useCallback(async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const bankCfg = getBankByCode(form.bankCode)!
    setSubmitting(true)
    setResult(null)

    const cedulaFmt = /^[VEJPGvejpg]/.test(form.cedula)
      ? form.cedula.toUpperCase()
      : `V${form.cedula}`

    // Teléfono opcional — si está vacío se envía string vacío
    const phoneClean = form.phone.replace(/\s/g, '')
    const phoneFmt = !phoneClean
      ? ''
      : phoneClean.startsWith('+58')
      ? '0' + phoneClean.slice(3)
      : phoneClean.startsWith('58') && phoneClean.length === 12
      ? '0' + phoneClean.slice(2)
      : phoneClean.startsWith('4') && phoneClean.length === 10
      ? '0' + phoneClean
      : phoneClean

    const amountFmt = parseFloat(form.amount.replace(',', '.')).toFixed(2)

    const payload: BDVRequest = {
      cedulaPagador:   cedulaFmt,
      telefonoPagador: phoneFmt,
      telefonoDestino: bankCfg.telefonoDestino,
      referencia:      form.ref.trim(),
      fechaPago:       form.date,
      importe:         amountFmt,
      bancoOrigen:     form.bankCode,
      reqCed:          form.bankCode === '0102' ? form.reqCed : false,
    }

    try {
      const res = await validatePayment(payload)
      setResult(res)
      savePago(res, cedulaFmt, phoneFmt).catch(console.error)
      onSuccess?.(res)
    } catch (err) {
      setErrors({ submit: (err as Error).message || 'Error de conexión con el banco' })
    } finally {
      setSubmitting(false)
    }
  }, [form, validate, onSuccess])

  const reset = useCallback(() => {
    setForm(makeInitialForm())
    setErrors({})
    setResult(null)
  }, [])

  return { form, setField, errors, submitting, result, submit, reset }
}