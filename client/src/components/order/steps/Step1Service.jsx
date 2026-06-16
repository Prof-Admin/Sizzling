import { useOrder, SERVICES } from '../../../context/OrderContext';

function ProgressBar({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10 overflow-hidden">
      {[1, 2, 3, 4, 5].map((n, i) => (
        <div key={n} className="flex items-center">
          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors shrink-0
            ${n === current ? 'bg-primary border-primary text-white' : n < current ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white border-gray-200 text-gray-400'}`}
          >
            {n < current ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : n}
          </div>
          {i < 4 && (
            <div className={`w-6 sm:w-14 h-0.5 mx-0.5 sm:mx-1 transition-colors shrink-0 ${n < current ? 'bg-primary/40' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Step1Service() {
  const { state, dispatch } = useOrder();
  const { service } = state;

  function select(id) {
    dispatch({ type: 'SET_SERVICE', payload: id });
    dispatch({ type: 'SET_STEP', payload: 2 });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <ProgressBar current={1} />

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark">How can we serve you?</h1>
        <p className="mt-3 text-dark-600">
          Experience the vibrant flavours of African heritage tailored to your specific event needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICES.map(svc => {
          const active = service === svc.id;
          return (
            <div
              key={svc.id}
              className={`bg-white rounded-sm overflow-hidden shadow-sm border-2 transition-all duration-200
                ${active ? 'border-gold shadow-md' : 'border-transparent hover:border-gray-200 hover:shadow-md'}`}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={svc.img}
                  alt={svc.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-serif font-bold text-dark mb-2">{svc.name}</h3>
                <p className="text-sm text-dark-600 leading-relaxed mb-5">{svc.desc}</p>
                <button
                  onClick={() => select(svc.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-sm border-2 transition-all duration-200
                    ${active
                      ? 'bg-gold border-gold text-white'
                      : 'border-gray-300 text-dark hover:border-gold hover:text-gold'
                    }`}
                >
                  Select Option
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
