export const LoadingState = () => (
  <div className="p-8 transition-all overflow-y-auto container flex flex-col items-center justify-center text-center">
    <div className="lds-roller">
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
    </div>
    <p className="font-medium text-xl">Loading...</p>
  </div>
)

export const NoResultsState = () => (
  <div className="p-8 transition-all overflow-y-auto container flex flex-col items-center justify-center text-center">
    <h1 className="font-bold text-8xl mb-4">404</h1>
    <p className="font-medium text-3xl">No results :&#40;</p>
    <p className="font-medium text-xl">Check again later!</p>
  </div>
)