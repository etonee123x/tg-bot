import KnownError from "@/helpers/KnownError"
import { ERRORS_MESSAGES } from "@/types"
import axios, { AxiosRequestConfig } from "axios"

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  axios.get<T>(url, config)
    .then(r => r.data)
    .catch(e => {
      throw e.response?.data
        ? e
        : new KnownError(ERRORS_MESSAGES.FETCHING_ERROR())
    })

export const post = <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => 
  axios.post<T>(url, data, config)
    .then(r => r.data)
    .catch((e) => {
      throw e.response?.data
        ? e
        : new KnownError(ERRORS_MESSAGES.FETCHING_ERROR())
    })
