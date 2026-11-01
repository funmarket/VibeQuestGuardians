import{createRuntimeIdentity}from'@vibe/contracts';
export{createReadinessResponse}from'@vibe/runtime-health';
export function apiIdentity(env:NodeJS.ProcessEnv){return createRuntimeIdentity('api',env)}