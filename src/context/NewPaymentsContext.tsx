import { createContext, useContext, useState, type ReactNode } from 'react'

interface Ctx {
  count: number
  increment: () => void
  reset: () => void
}

const NewPaymentsContext = createContext<Ctx>({ count: 0, increment: () => {}, reset: () => {} })

export function NewPaymentsProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  return (
    <NewPaymentsContext.Provider value={{
      count,
      increment: () => setCount(c => c + 1),
      reset: () => setCount(0),
    }}>
      {children}
    </NewPaymentsContext.Provider>
  )
}

export const useNewPayments = () => useContext(NewPaymentsContext)
