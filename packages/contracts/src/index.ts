export type RuntimeService='api'|'worker';
export interface RuntimeIdentity{service:RuntimeService;environment:string;revision:string;gitSha:string;deploymentId:string}
export interface ReadinessCheck{name:string;ok:boolean;detail?:string}
export interface ReadinessResponse{status:'ready'|'not_ready';identity:RuntimeIdentity;checks:ReadinessCheck[]}
export function createRuntimeIdentity(service:RuntimeService,env:NodeJS.ProcessEnv):RuntimeIdentity{return{service,environment:env.VQ_ENVIRONMENT??env.NODE_ENV??'unknown',revision:env.VQ_SERVICE_REVISION??'unknown',gitSha:env.VQ_GIT_SHA??'unknown',deploymentId:env.VQ_DEPLOYMENT_ID??'unknown'}}