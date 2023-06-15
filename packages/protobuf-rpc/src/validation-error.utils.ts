import { ValidationError } from './gen/tech/monstrs/rpc/v1alpha1/validation-error_pb.js'

export interface MaybeConnectError {
  details?: Array<{
    type: string
    value: Uint8Array
  }>
}

export const findValidationErrorDetails = (error: MaybeConnectError): Array<ValidationError> => {
  if (Array.isArray(error?.details)) {
    return error.details
      .filter((detail) => detail.type === ValidationError.typeName)
      .map((detail) => ValidationError.fromBinary(detail.value))
  }

  return []
}
