import api from './axios'
import { Org } from '../types'

export const getMyOrgApi = () => api.get<Org>('/orgs').then(r => r.data)

export const regenerateInviteApi = () => api.post<Org>('/orgs/invite/regenerate').then(r => r.data)

export default { getMyOrgApi, regenerateInviteApi }
