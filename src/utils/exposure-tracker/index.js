import VisuallyObserver from './visuallyObserver'

function getExposureTrackerProps(action, params) {
  return {
    'data-exposure-tracker-action': action,
    'data-exposure-tracker-params': params ? JSON.stringify(params) : undefined
  }
}

export {
  VisuallyObserver,
  getExposureTrackerProps
}
