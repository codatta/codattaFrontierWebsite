import './Title.scss'

const Title = () => {
  return (
    <div className="text-left flex flex-col justify-between">
      <h1 className="w-785px h-148px">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800"
          height="224"
          fill="none"
          viewBox="0 0 500 224"
        >
          <text x="0%" y="25%" textAnchor="left" className="text-1">
            Let's annotate crypto
          </text>
          <text x="0%" y="45%" textAnchor="left" className="text-2">
            addresses from here
          </text>
        </svg> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="785"
          height="148"
          fill="none"
          viewBox="0 0 785 148"
        >
          <path
            fill="#fff"
            className="path"
            d="M2.739 59V.818h10.54v49.347h25.624V59H2.74Zm62.576.852c-4.375 0-8.154-.909-11.335-2.727-3.163-1.837-5.597-4.432-7.302-7.784-1.704-3.371-2.556-7.34-2.556-11.904 0-4.488.852-8.427 2.556-11.818 1.724-3.409 4.13-6.06 7.216-7.954 3.087-1.913 6.714-2.87 10.881-2.87 2.69 0 5.227.436 7.614 1.307a17.207 17.207 0 0 1 6.363 3.977c1.856 1.8 3.315 4.091 4.375 6.875 1.06 2.766 1.591 6.061 1.591 9.887v3.153H48.951v-6.931h25.91c-.02-1.97-.446-3.722-1.28-5.256a9.296 9.296 0 0 0-3.493-3.665c-1.478-.89-3.201-1.335-5.171-1.335-2.102 0-3.949.511-5.54 1.534a10.57 10.57 0 0 0-3.721 3.977c-.871 1.629-1.317 3.419-1.335 5.37v6.05c0 2.538.464 4.717 1.392 6.535.928 1.799 2.225 3.181 3.892 4.147 1.666.947 3.617 1.42 5.852 1.42 1.496 0 2.85-.207 4.062-.624a9.015 9.015 0 0 0 3.154-1.904c.89-.833 1.562-1.865 2.017-3.096l9.602 1.08c-.606 2.537-1.761 4.753-3.466 6.647-1.685 1.875-3.845 3.334-6.477 4.375-2.633 1.023-5.644 1.534-9.034 1.534Zm48.293-44.488v7.954H88.523v-7.954h25.085ZM94.716 4.909H105v40.966c0 1.383.209 2.443.625 3.182.436.72 1.004 1.212 1.705 1.477.701.265 1.477.398 2.329.398.644 0 1.231-.047 1.762-.142.549-.095.966-.18 1.25-.256l1.733 8.04c-.55.19-1.336.398-2.358.625-1.004.227-2.235.36-3.693.398-2.576.075-4.896-.313-6.961-1.165-2.064-.871-3.702-2.216-4.914-4.034-1.194-1.819-1.78-4.091-1.762-6.819V4.91ZM127.711.82v21.42h-7.841V.819h7.841Zm42.818 26.079-9.375 1.023c-.265-.947-.729-1.838-1.392-2.671-.644-.833-1.515-1.506-2.614-2.017-1.098-.511-2.443-.767-4.034-.767-2.14 0-3.939.464-5.398 1.392-1.439.928-2.149 2.13-2.13 3.608-.019 1.269.445 2.301 1.392 3.096.966.796 2.557 1.45 4.773 1.96l7.443 1.592c4.129.89 7.197 2.3 9.204 4.233 2.027 1.931 3.05 4.46 3.068 7.585-.018 2.746-.823 5.17-2.414 7.273-1.572 2.083-3.76 3.712-6.563 4.886s-6.023 1.761-9.659 1.761c-5.341 0-9.64-1.117-12.898-3.352-3.257-2.254-5.198-5.388-5.823-9.403l10.028-.966c.454 1.97 1.42 3.456 2.898 4.46 1.477 1.004 3.399 1.506 5.767 1.506 2.443 0 4.403-.502 5.88-1.506 1.497-1.004 2.245-2.244 2.245-3.722 0-1.25-.483-2.282-1.449-3.096-.947-.815-2.424-1.44-4.432-1.875l-7.443-1.563c-4.186-.871-7.282-2.339-9.29-4.403-2.008-2.084-3.002-4.716-2.983-7.898-.019-2.69.71-5.019 2.188-6.988 1.496-1.99 3.57-3.523 6.221-4.603 2.671-1.098 5.748-1.648 9.233-1.648 5.114 0 9.138 1.09 12.074 3.268 2.955 2.178 4.782 5.123 5.483 8.835Zm38.618 32.983c-2.765 0-5.256-.493-7.471-1.478-2.197-1.003-3.94-2.48-5.228-4.431-1.269-1.951-1.903-4.357-1.903-7.216 0-2.462.454-4.498 1.364-6.108a10.55 10.55 0 0 1 3.721-3.864c1.572-.966 3.343-1.695 5.313-2.187a43.18 43.18 0 0 1 6.164-1.108 242.82 242.82 0 0 0 6.222-.71c1.591-.228 2.746-.569 3.466-1.023.739-.474 1.108-1.203 1.108-2.188v-.17c0-2.14-.635-3.798-1.904-4.972-1.269-1.174-3.096-1.761-5.483-1.761-2.518 0-4.517.549-5.994 1.648-1.458 1.098-2.443 2.395-2.954 3.892l-9.603-1.364c.758-2.652 2.008-4.867 3.75-6.648 1.743-1.8 3.873-3.144 6.392-4.034 2.519-.909 5.303-1.363 8.353-1.363 2.102 0 4.195.246 6.278.738a17.66 17.66 0 0 1 5.71 2.443c1.724 1.118 3.106 2.642 4.148 4.574 1.061 1.932 1.591 4.347 1.591 7.245V59h-9.886v-5.994h-.341c-.625 1.212-1.506 2.348-2.642 3.409-1.118 1.041-2.529 1.884-4.233 2.528-1.686.625-3.665.938-5.938.938Zm2.671-7.557c2.064 0 3.854-.407 5.369-1.222 1.515-.833 2.68-1.931 3.494-3.295a8.388 8.388 0 0 0 1.25-4.46v-5.142c-.322.265-.871.51-1.647.738a23.35 23.35 0 0 1-2.557.597c-.947.17-1.885.322-2.813.454-.928.133-1.733.246-2.415.341-1.534.209-2.907.55-4.119 1.023-1.212.473-2.168 1.136-2.869 1.989-.701.833-1.051 1.913-1.051 3.238 0 1.894.691 3.324 2.074 4.29 1.382.966 3.143 1.449 5.284 1.449Zm39.394-18.892V59h-10.284V15.364h9.829v7.414h.512c1.004-2.443 2.604-4.384 4.801-5.823 2.216-1.44 4.953-2.16 8.21-2.16 3.011 0 5.635.644 7.869 1.932 2.254 1.288 3.997 3.154 5.228 5.597 1.25 2.443 1.865 5.407 1.846 8.892V59h-10.284V32.807c0-2.917-.757-5.199-2.273-6.847-1.496-1.648-3.57-2.471-6.221-2.471-1.799 0-3.4.397-4.801 1.193-1.383.776-2.472 1.903-3.267 3.38-.777 1.478-1.165 3.267-1.165 5.37Zm47.15 0V59h-10.284V15.364h9.829v7.414h.512c1.004-2.443 2.604-4.384 4.801-5.823 2.216-1.44 4.953-2.16 8.21-2.16 3.011 0 5.635.644 7.869 1.932 2.254 1.288 3.997 3.154 5.228 5.597 1.25 2.443 1.865 5.407 1.846 8.892V59h-10.284V32.807c0-2.917-.757-5.199-2.273-6.847-1.496-1.648-3.57-2.471-6.221-2.471-1.799 0-3.4.397-4.801 1.193-1.383.776-2.472 1.903-3.267 3.38-.777 1.478-1.165 3.267-1.165 5.37Zm55.9 26.42c-4.261 0-7.955-.937-11.08-2.812-3.125-1.875-5.549-4.498-7.272-7.87-1.705-3.37-2.557-7.31-2.557-11.818 0-4.507.852-8.456 2.557-11.846 1.723-3.39 4.147-6.023 7.272-7.898s6.819-2.813 11.08-2.813 7.954.938 11.079 2.813c3.125 1.875 5.54 4.508 7.245 7.898 1.723 3.39 2.585 7.339 2.585 11.846 0 4.508-.862 8.447-2.585 11.819-1.705 3.37-4.12 5.994-7.245 7.869s-6.818 2.812-11.079 2.812Zm.057-8.238c2.31 0 4.242-.635 5.795-1.904 1.553-1.288 2.709-3.011 3.466-5.17.777-2.16 1.165-4.565 1.165-7.216 0-2.67-.388-5.085-1.165-7.244-.757-2.178-1.913-3.911-3.466-5.2-1.553-1.287-3.485-1.931-5.795-1.931-2.368 0-4.337.644-5.909 1.932-1.553 1.288-2.718 3.02-3.495 5.198-.757 2.16-1.136 4.574-1.136 7.245 0 2.651.379 5.057 1.136 7.216.777 2.159 1.942 3.882 3.495 5.17 1.572 1.27 3.541 1.904 5.909 1.904Zm49.77-36.25v7.954h-25.085v-7.954h25.085ZM385.197 4.909h10.285v40.966c0 1.383.208 2.443.625 3.182.435.72 1.003 1.212 1.704 1.477.701.265 1.477.398 2.33.398.644 0 1.231-.047 1.761-.142.549-.095.966-.18 1.25-.256l1.733 8.04c-.549.19-1.335.398-2.358.625-1.004.227-2.235.36-3.693.398-2.576.075-4.896-.313-6.96-1.165-2.065-.871-3.703-2.216-4.915-4.034-1.193-1.819-1.78-4.091-1.762-6.819V4.91Zm38.45 54.972c-2.765 0-5.256-.493-7.471-1.478-2.197-1.003-3.94-2.48-5.228-4.431-1.269-1.951-1.903-4.357-1.903-7.216 0-2.462.454-4.498 1.364-6.108a10.55 10.55 0 0 1 3.721-3.864c1.572-.966 3.343-1.695 5.313-2.187a43.18 43.18 0 0 1 6.164-1.108 242.82 242.82 0 0 0 6.222-.71c1.591-.228 2.746-.569 3.466-1.023.739-.474 1.108-1.203 1.108-2.188v-.17c0-2.14-.635-3.798-1.904-4.972-1.269-1.174-3.096-1.761-5.483-1.761-2.518 0-4.517.549-5.994 1.648-1.458 1.098-2.443 2.395-2.954 3.892l-9.603-1.364c.758-2.652 2.008-4.867 3.75-6.648 1.743-1.8 3.873-3.144 6.392-4.034 2.519-.909 5.303-1.363 8.353-1.363 2.102 0 4.195.246 6.278.738a17.66 17.66 0 0 1 5.71 2.443c1.724 1.118 3.106 2.642 4.148 4.574 1.061 1.932 1.591 4.347 1.591 7.245V59h-9.886v-5.994h-.341c-.625 1.212-1.506 2.348-2.642 3.409-1.118 1.041-2.529 1.884-4.233 2.528-1.686.625-3.665.938-5.938.938Zm2.671-7.557c2.064 0 3.854-.407 5.369-1.222 1.515-.833 2.68-1.931 3.494-3.295a8.388 8.388 0 0 0 1.25-4.46v-5.142c-.322.265-.871.51-1.647.738a23.35 23.35 0 0 1-2.557.597c-.947.17-1.885.322-2.813.454-.928.133-1.733.246-2.415.341-1.534.209-2.907.55-4.119 1.023-1.212.473-2.168 1.136-2.869 1.989-.701.833-1.051 1.913-1.051 3.238 0 1.894.691 3.324 2.074 4.29 1.382.966 3.143 1.449 5.284 1.449Zm50.9-36.96v7.954h-25.086v-7.954h25.086ZM458.326 4.909h10.284v40.966c0 1.383.208 2.443.625 3.182.435.72 1.003 1.212 1.704 1.477.701.265 1.477.398 2.33.398.644 0 1.231-.047 1.761-.142.549-.095.966-.18 1.25-.256l1.733 8.04c-.549.19-1.335.398-2.358.625-1.004.227-2.235.36-3.693.398-2.576.075-4.896-.313-6.96-1.165-2.065-.871-3.703-2.216-4.915-4.034-1.193-1.819-1.78-4.091-1.761-6.819V4.91Zm44.742 54.943c-4.375 0-8.153-.909-11.335-2.727-3.163-1.837-5.597-4.432-7.301-7.784-1.705-3.371-2.557-7.34-2.557-11.904 0-4.488.852-8.427 2.557-11.818 1.723-3.409 4.128-6.06 7.215-7.954 3.088-1.913 6.714-2.87 10.881-2.87 2.69 0 5.227.436 7.614 1.307a17.206 17.206 0 0 1 6.363 3.977c1.856 1.8 3.315 4.091 4.375 6.875 1.061 2.766 1.591 6.061 1.591 9.887v3.153h-35.767v-6.931h25.909c-.019-1.97-.445-3.722-1.278-5.256a9.294 9.294 0 0 0-3.494-3.665c-1.478-.89-3.201-1.335-5.171-1.335-2.102 0-3.949.511-5.54 1.534a10.575 10.575 0 0 0-3.721 3.977c-.871 1.629-1.316 3.419-1.335 5.37v6.05c0 2.538.464 4.717 1.392 6.535.928 1.799 2.225 3.181 3.892 4.147 1.666.947 3.617 1.42 5.852 1.42 1.496 0 2.85-.207 4.062-.624a9.009 9.009 0 0 0 3.154-1.904c.89-.833 1.562-1.865 2.017-3.096l9.602 1.08c-.606 2.537-1.761 4.753-3.466 6.647-1.685 1.875-3.844 3.334-6.477 4.375-2.633 1.023-5.644 1.534-9.034 1.534Zm63.781 0c-4.356 0-8.096-.956-11.221-2.869-3.106-1.913-5.502-4.555-7.188-7.926-1.666-3.39-2.5-7.292-2.5-11.705 0-4.431.853-8.342 2.557-11.733 1.705-3.409 4.11-6.06 7.216-7.954 3.125-1.913 6.818-2.87 11.08-2.87 3.541 0 6.676.654 9.403 1.96 2.746 1.289 4.934 3.116 6.563 5.484 1.628 2.348 2.556 5.094 2.784 8.238h-9.83c-.398-2.102-1.345-3.854-2.841-5.255-1.477-1.42-3.456-2.131-5.937-2.131-2.103 0-3.949.568-5.54 1.704-1.591 1.118-2.832 2.728-3.722 4.83-.871 2.102-1.307 4.621-1.307 7.557 0 2.973.436 5.53 1.307 7.67.872 2.122 2.093 3.76 3.665 4.915 1.591 1.136 3.457 1.705 5.597 1.705 1.515 0 2.869-.285 4.062-.853a8.168 8.168 0 0 0 3.04-2.528c.814-1.099 1.373-2.434 1.676-4.006h9.83c-.247 3.087-1.156 5.824-2.728 8.21-1.572 2.368-3.712 4.224-6.42 5.569-2.708 1.325-5.89 1.988-9.546 1.988ZM592.387 59V15.364h9.972v7.272h.454c.796-2.519 2.159-4.46 4.091-5.823 1.951-1.383 4.176-2.074 6.676-2.074.569 0 1.203.028 1.904.085.72.038 1.316.104 1.79.199v9.46c-.436-.152-1.127-.284-2.074-.398a19.097 19.097 0 0 0-2.699-.199c-1.875 0-3.561.408-5.057 1.222a8.939 8.939 0 0 0-3.494 3.324c-.853 1.42-1.279 3.059-1.279 4.915V59h-10.284Zm37.839 16.364c-1.401 0-2.699-.114-3.892-.341-1.174-.209-2.112-.455-2.812-.739l2.386-8.011c1.496.435 2.831.644 4.006.625 1.174-.02 2.206-.388 3.096-1.108.909-.701 1.676-1.875 2.301-3.523l.881-2.358-15.824-44.545h10.909l10.057 32.954h.455l10.085-32.954h10.937l-17.471 48.92c-.815 2.31-1.894 4.29-3.239 5.938a13.162 13.162 0 0 1-4.943 3.806c-1.932.89-4.242 1.336-6.932 1.336Zm38.102 0v-60h10.113v7.215h.597c.53-1.06 1.278-2.187 2.244-3.38.966-1.212 2.273-2.245 3.921-3.097 1.648-.87 3.75-1.306 6.307-1.306 3.371 0 6.411.861 9.119 2.585 2.727 1.704 4.886 4.233 6.477 7.585 1.61 3.333 2.415 7.424 2.415 12.273 0 4.791-.786 8.863-2.358 12.216-1.572 3.352-3.712 5.909-6.42 7.67-2.709 1.761-5.777 2.642-9.205 2.642-2.5 0-4.574-.417-6.222-1.25-1.647-.833-2.973-1.837-3.977-3.011-.985-1.194-1.752-2.32-2.301-3.381h-.426v23.239h-10.284Zm10.085-38.182c0 2.822.398 5.293 1.193 7.415.815 2.12 1.979 3.778 3.495 4.971 1.534 1.174 3.39 1.762 5.568 1.762 2.272 0 4.176-.606 5.71-1.819 1.534-1.23 2.689-2.907 3.466-5.028.795-2.14 1.193-4.574 1.193-7.301 0-2.709-.388-5.114-1.165-7.216-.776-2.102-1.932-3.75-3.466-4.943-1.534-1.194-3.447-1.79-5.738-1.79-2.197 0-4.063.578-5.597 1.733-1.534 1.155-2.699 2.774-3.494 4.858-.777 2.083-1.165 4.536-1.165 7.358Zm60.105-21.818v7.954h-25.086v-7.954h25.086ZM719.626 4.909h10.284v40.966c0 1.383.208 2.443.625 3.182.435.72 1.003 1.212 1.704 1.477.701.265 1.477.398 2.33.398.644 0 1.231-.047 1.761-.142.549-.095.966-.18 1.25-.256l1.733 8.04c-.549.19-1.335.398-2.358.625-1.004.227-2.235.36-3.693.398-2.576.075-4.896-.313-6.96-1.165-2.065-.871-3.703-2.216-4.915-4.034-1.193-1.819-1.78-4.091-1.761-6.819V4.91Zm44.458 54.943c-4.262 0-7.955-.937-11.08-2.812-3.125-1.875-5.549-4.498-7.272-7.87-1.705-3.37-2.557-7.31-2.557-11.818 0-4.507.852-8.456 2.557-11.846 1.723-3.39 4.147-6.023 7.272-7.898s6.818-2.813 11.08-2.813c4.261 0 7.954.938 11.079 2.813 3.125 1.875 5.54 4.508 7.245 7.898 1.723 3.39 2.585 7.339 2.585 11.846 0 4.508-.862 8.447-2.585 11.819-1.705 3.37-4.12 5.994-7.245 7.869s-6.818 2.812-11.079 2.812Zm.057-8.238c2.31 0 4.242-.635 5.795-1.904 1.553-1.288 2.708-3.011 3.466-5.17.777-2.16 1.165-4.565 1.165-7.216 0-2.67-.388-5.085-1.165-7.244-.758-2.178-1.913-3.911-3.466-5.2-1.553-1.287-3.485-1.931-5.795-1.931-2.368 0-4.337.644-5.909 1.932-1.553 1.288-2.718 3.02-3.495 5.198-.757 2.16-1.136 4.574-1.136 7.245 0 2.651.379 5.057 1.136 7.216.777 2.159 1.942 3.882 3.495 5.17 1.572 1.27 3.541 1.904 5.909 1.904Zm-749.3 96.267c-2.765 0-5.256-.493-7.472-1.478-2.197-1.003-3.94-2.481-5.227-4.431-1.269-1.951-1.903-4.356-1.903-7.216 0-2.462.454-4.498 1.363-6.108.91-1.61 2.15-2.898 3.722-3.864 1.572-.966 3.343-1.695 5.312-2.187a43.075 43.075 0 0 1 6.165-1.108c2.557-.266 4.63-.502 6.222-.711 1.59-.227 2.746-.568 3.466-1.022.738-.474 1.108-1.203 1.108-2.188v-.17c0-2.14-.635-3.798-1.904-4.972-1.269-1.174-3.096-1.761-5.483-1.761-2.519 0-4.517.549-5.994 1.647-1.458 1.099-2.443 2.396-2.955 3.893l-9.602-1.364c.758-2.652 2.008-4.868 3.75-6.648 1.743-1.799 3.873-3.144 6.392-4.034 2.52-.909 5.303-1.364 8.352-1.364 2.103 0 4.196.247 6.279.739a17.683 17.683 0 0 1 5.71 2.443c1.723 1.118 3.106 2.642 4.148 4.574 1.06 1.932 1.59 4.347 1.59 7.244V147h-9.886v-5.994h-.34c-.626 1.212-1.506 2.348-2.643 3.409-1.117 1.041-2.528 1.884-4.233 2.528-1.685.625-3.664.938-5.937.938Zm2.67-7.557c2.065 0 3.855-.407 5.37-1.222 1.515-.833 2.68-1.932 3.494-3.295a8.397 8.397 0 0 0 1.25-4.46v-5.142c-.322.265-.871.511-1.648.738-.757.227-1.61.426-2.556.597-.947.17-1.885.322-2.813.454-.928.133-1.733.247-2.415.341-1.534.209-2.907.549-4.12 1.023-1.211.473-2.168 1.136-2.869 1.989-.7.833-1.05 1.912-1.05 3.238 0 1.894.69 3.324 2.073 4.29 1.383.966 3.144 1.449 5.284 1.449Zm45.304 7.443c-3.428 0-6.496-.881-9.205-2.642-2.708-1.761-4.848-4.318-6.42-7.67-1.572-3.353-2.358-7.425-2.358-12.216 0-4.849.795-8.94 2.386-12.273 1.61-3.352 3.779-5.881 6.506-7.585 2.727-1.724 5.767-2.586 9.12-2.586 2.556 0 4.658.436 6.306 1.307 1.648.853 2.954 1.885 3.92 3.097.966 1.193 1.715 2.32 2.245 3.381h.426V88.818h10.312V147H75.94v-6.875h-.625c-.53 1.061-1.298 2.187-2.301 3.381-1.004 1.174-2.33 2.178-3.978 3.011-1.647.833-3.721 1.25-6.221 1.25Zm2.87-8.437c2.177 0 4.033-.588 5.567-1.762 1.534-1.193 2.7-2.85 3.495-4.971.795-2.122 1.193-4.593 1.193-7.415s-.398-5.275-1.193-7.358c-.777-2.083-1.932-3.703-3.466-4.858-1.516-1.155-3.381-1.733-5.597-1.733-2.292 0-4.204.597-5.738 1.79-1.535 1.193-2.69 2.841-3.466 4.943-.777 2.102-1.165 4.507-1.165 7.216 0 2.727.388 5.161 1.165 7.301.795 2.121 1.96 3.797 3.494 5.028 1.553 1.212 3.456 1.819 5.71 1.819Zm45.92 8.437c-3.428 0-6.496-.881-9.204-2.642-2.709-1.761-4.849-4.318-6.42-7.67-1.573-3.353-2.359-7.425-2.359-12.216 0-4.849.796-8.94 2.387-12.273 1.61-3.352 3.778-5.881 6.505-7.585 2.728-1.724 5.768-2.586 9.12-2.586 2.557 0 4.659.436 6.307 1.307 1.647.853 2.954 1.885 3.92 3.097.966 1.193 1.714 2.32 2.244 3.381h.427V88.818h10.312V147H124.73v-6.875h-.625c-.53 1.061-1.297 2.187-2.301 3.381-1.004 1.174-2.329 2.178-3.977 3.011-1.648.833-3.722 1.25-6.222 1.25Zm2.87-8.437c2.178 0 4.034-.588 5.568-1.762 1.534-1.193 2.699-2.85 3.494-4.971.796-2.122 1.193-4.593 1.193-7.415s-.397-5.275-1.193-7.358c-.776-2.083-1.932-3.703-3.466-4.858-1.515-1.155-3.38-1.733-5.596-1.733-2.292 0-4.205.597-5.739 1.79-1.534 1.193-2.689 2.841-3.466 4.943-.776 2.102-1.165 4.507-1.165 7.216 0 2.727.389 5.161 1.165 7.301.796 2.121 1.96 3.797 3.494 5.028 1.554 1.212 3.457 1.819 5.711 1.819Zm29.728 7.67v-43.636h9.971v7.272h.455c.795-2.519 2.159-4.46 4.091-5.824 1.951-1.382 4.176-2.073 6.676-2.073.568 0 1.203.028 1.903.085.72.038 1.317.104 1.79.199v9.46c-.435-.152-1.127-.284-2.074-.398a19.162 19.162 0 0 0-2.699-.199c-1.875 0-3.56.408-5.056 1.222a8.935 8.935 0 0 0-3.495 3.324c-.852 1.42-1.278 3.059-1.278 4.915V147h-10.284Zm47.64.852c-4.375 0-8.154-.909-11.335-2.727-3.163-1.837-5.597-4.432-7.301-7.784-1.705-3.371-2.557-7.339-2.557-11.903 0-4.489.852-8.429 2.557-11.819 1.723-3.409 4.128-6.06 7.215-7.954 3.088-1.913 6.714-2.87 10.881-2.87 2.69 0 5.227.436 7.614 1.307a17.208 17.208 0 0 1 6.363 3.978c1.856 1.799 3.315 4.09 4.375 6.875 1.061 2.765 1.591 6.06 1.591 9.886v3.153h-35.767v-6.932h25.909c-.019-1.969-.445-3.721-1.278-5.255a9.294 9.294 0 0 0-3.494-3.665c-1.478-.89-3.201-1.335-5.171-1.335-2.102 0-3.949.511-5.54 1.534a10.566 10.566 0 0 0-3.721 3.977c-.871 1.629-1.316 3.419-1.335 5.37v6.051c0 2.538.464 4.716 1.392 6.534.928 1.799 2.225 3.182 3.892 4.147 1.666.947 3.617 1.421 5.852 1.421 1.496 0 2.85-.208 4.062-.625a9.006 9.006 0 0 0 3.154-1.904c.89-.833 1.562-1.865 2.017-3.096l9.602 1.079c-.606 2.538-1.761 4.754-3.466 6.648-1.685 1.875-3.844 3.334-6.477 4.375-2.633 1.023-5.644 1.534-9.034 1.534Zm60.992-32.954-9.375 1.022c-.265-.947-.729-1.837-1.392-2.67-.644-.833-1.515-1.506-2.613-2.017-1.099-.511-2.444-.767-4.035-.767-2.14 0-3.939.464-5.397 1.392-1.44.928-2.15 2.131-2.131 3.608-.019 1.269.445 2.301 1.392 3.096.966.796 2.557 1.449 4.773 1.961l7.443 1.591c4.129.89 7.197 2.301 9.205 4.233 2.026 1.931 3.049 4.46 3.068 7.585-.019 2.746-.824 5.17-2.415 7.273-1.572 2.083-3.76 3.712-6.563 4.886s-6.022 1.761-9.659 1.761c-5.341 0-9.64-1.117-12.897-3.352-3.258-2.254-5.199-5.388-5.824-9.403l10.028-.966c.455 1.969 1.421 3.456 2.898 4.46s3.4 1.506 5.767 1.506c2.443 0 4.403-.502 5.881-1.506 1.496-1.004 2.244-2.244 2.244-3.722 0-1.25-.483-2.282-1.449-3.096-.947-.815-2.424-1.44-4.432-1.875l-7.443-1.563c-4.186-.871-7.282-2.339-9.29-4.403-2.007-2.084-3.002-4.716-2.983-7.898-.019-2.689.711-5.019 2.188-6.989 1.496-1.988 3.57-3.522 6.221-4.602 2.671-1.098 5.749-1.648 9.233-1.648 5.114 0 9.139 1.089 12.074 3.267 2.955 2.179 4.782 5.124 5.483 8.836Zm42.306 0-9.375 1.022c-.265-.947-.729-1.837-1.392-2.67-.644-.833-1.515-1.506-2.613-2.017-1.099-.511-2.443-.767-4.034-.767-2.14 0-3.94.464-5.398 1.392-1.439.928-2.15 2.131-2.131 3.608-.019 1.269.445 2.301 1.392 3.096.966.796 2.557 1.449 4.773 1.961l7.443 1.591c4.129.89 7.197 2.301 9.205 4.233 2.026 1.931 3.049 4.46 3.068 7.585-.019 2.746-.824 5.17-2.415 7.273-1.572 2.083-3.759 3.712-6.562 4.886-2.803 1.174-6.023 1.761-9.659 1.761-5.341 0-9.641-1.117-12.898-3.352-3.258-2.254-5.199-5.388-5.824-9.403l10.028-.966c.455 1.969 1.421 3.456 2.898 4.46s3.4 1.506 5.767 1.506c2.443 0 4.404-.502 5.881-1.506 1.496-1.004 2.244-2.244 2.244-3.722 0-1.25-.483-2.282-1.449-3.096-.947-.815-2.424-1.44-4.431-1.875l-7.444-1.563c-4.185-.871-7.282-2.339-9.289-4.403-2.008-2.084-3.002-4.716-2.983-7.898-.019-2.689.71-5.019 2.187-6.989 1.496-1.988 3.57-3.522 6.222-4.602 2.67-1.098 5.748-1.648 9.233-1.648 5.113 0 9.138 1.089 12.074 3.267 2.954 2.179 4.782 5.124 5.482 8.836Zm27.136 32.954c-4.375 0-8.153-.909-11.335-2.727-3.163-1.837-5.597-4.432-7.301-7.784-1.705-3.371-2.557-7.339-2.557-11.903 0-4.489.852-8.429 2.557-11.819 1.723-3.409 4.129-6.06 7.216-7.954 3.087-1.913 6.714-2.87 10.88-2.87 2.69 0 5.228.436 7.614 1.307a17.212 17.212 0 0 1 6.364 3.978c1.856 1.799 3.314 4.09 4.375 6.875 1.06 2.765 1.591 6.06 1.591 9.886v3.153h-35.767v-6.932h25.909c-.019-1.969-.445-3.721-1.279-5.255a9.294 9.294 0 0 0-3.494-3.665c-1.477-.89-3.201-1.335-5.17-1.335-2.103 0-3.949.511-5.54 1.534a10.568 10.568 0 0 0-3.722 3.977c-.871 1.629-1.316 3.419-1.335 5.37v6.051c0 2.538.464 4.716 1.392 6.534.928 1.799 2.225 3.182 3.892 4.147 1.667.947 3.617 1.421 5.852 1.421 1.497 0 2.851-.208 4.063-.625a9.01 9.01 0 0 0 3.153-1.904c.89-.833 1.563-1.865 2.017-3.096l9.603 1.079c-.607 2.538-1.762 4.754-3.466 6.648-1.686 1.875-3.845 3.334-6.478 4.375-2.632 1.023-5.644 1.534-9.034 1.534Zm60.993-32.954-9.375 1.022c-.266-.947-.73-1.837-1.392-2.67-.644-.833-1.516-1.506-2.614-2.017-1.099-.511-2.443-.767-4.034-.767-2.14 0-3.94.464-5.398 1.392-1.439.928-2.15 2.131-2.131 3.608-.019 1.269.446 2.301 1.392 3.096.966.796 2.557 1.449 4.773 1.961l7.443 1.591c4.129.89 7.197 2.301 9.205 4.233 2.026 1.931 3.049 4.46 3.068 7.585-.019 2.746-.824 5.17-2.415 7.273-1.572 2.083-3.759 3.712-6.562 4.886-2.803 1.174-6.023 1.761-9.659 1.761-5.341 0-9.64-1.117-12.898-3.352-3.258-2.254-5.199-5.388-5.824-9.403l10.029-.966c.454 1.969 1.42 3.456 2.897 4.46 1.478 1.004 3.4 1.506 5.767 1.506 2.444 0 4.404-.502 5.881-1.506 1.496-1.004 2.244-2.244 2.244-3.722 0-1.25-.483-2.282-1.449-3.096-.946-.815-2.424-1.44-4.431-1.875l-7.444-1.563c-4.185-.871-7.282-2.339-9.289-4.403-2.008-2.084-3.002-4.716-2.983-7.898-.019-2.689.71-5.019 2.187-6.989 1.496-1.988 3.57-3.522 6.222-4.602 2.67-1.098 5.748-1.648 9.233-1.648 5.113 0 9.138 1.089 12.074 3.267 2.954 2.179 4.782 5.124 5.483 8.836Zm48.163-11.534v7.954h-25.795v-7.954h25.795ZM412.087 147V99.244c0-2.935.606-5.379 1.818-7.33 1.231-1.95 2.879-3.408 4.943-4.374 2.064-.966 4.356-1.45 6.875-1.45 1.78 0 3.362.143 4.744.427 1.383.284 2.406.54 3.069.767l-2.046 7.955a17.862 17.862 0 0 0-1.648-.398 9.962 9.962 0 0 0-2.216-.227c-1.912 0-3.267.464-4.062 1.392-.777.909-1.165 2.216-1.165 3.92V147h-10.312Zm25.8 0v-43.636h9.972v7.272h.454c.796-2.519 2.159-4.46 4.091-5.824 1.951-1.382 4.176-2.073 6.676-2.073.569 0 1.203.028 1.904.085.719.038 1.316.104 1.79.199v9.46c-.436-.152-1.127-.284-2.074-.398a19.173 19.173 0 0 0-2.699-.199c-1.875 0-3.561.408-5.057 1.222a8.932 8.932 0 0 0-3.494 3.324c-.853 1.42-1.279 3.059-1.279 4.915V147h-10.284Zm47.356.852c-4.261 0-7.954-.937-11.079-2.812-3.125-1.875-5.55-4.498-7.273-7.87-1.705-3.371-2.557-7.31-2.557-11.818 0-4.507.852-8.456 2.557-11.846 1.723-3.39 4.148-6.023 7.273-7.898s6.818-2.813 11.079-2.813c4.262 0 7.955.938 11.08 2.813 3.125 1.875 5.539 4.508 7.244 7.898 1.724 3.39 2.585 7.339 2.585 11.846 0 4.508-.861 8.447-2.585 11.818-1.705 3.372-4.119 5.995-7.244 7.87s-6.818 2.812-11.08 2.812Zm.057-8.238c2.311 0 4.242-.635 5.795-1.904 1.553-1.288 2.709-3.011 3.466-5.17.777-2.159 1.165-4.565 1.165-7.216 0-2.671-.388-5.085-1.165-7.244-.757-2.178-1.913-3.911-3.466-5.199-1.553-1.288-3.484-1.932-5.795-1.932-2.367 0-4.337.644-5.909 1.932-1.553 1.288-2.718 3.021-3.494 5.199-.758 2.159-1.137 4.573-1.137 7.244 0 2.651.379 5.057 1.137 7.216.776 2.159 1.941 3.882 3.494 5.17 1.572 1.269 3.542 1.904 5.909 1.904ZM513.281 147v-43.636h9.83v7.414h.511c.909-2.5 2.415-4.45 4.517-5.852 2.102-1.42 4.612-2.131 7.528-2.131 2.955 0 5.445.72 7.472 2.16 2.045 1.42 3.485 3.361 4.318 5.823h.455c.966-2.424 2.594-4.356 4.886-5.795 2.311-1.458 5.047-2.188 8.21-2.188 4.015 0 7.292 1.269 9.83 3.807 2.538 2.538 3.807 6.241 3.807 11.108V147h-10.313v-27.699c0-2.708-.72-4.687-2.159-5.937-1.439-1.269-3.201-1.904-5.284-1.904-2.481 0-4.422.777-5.824 2.33-1.383 1.534-2.074 3.532-2.074 5.994V147h-10.085v-28.125c0-2.254-.682-4.053-2.045-5.398-1.345-1.344-3.107-2.017-5.285-2.017-1.477 0-2.822.379-4.034 1.137-1.212.738-2.178 1.789-2.897 3.153-.72 1.345-1.08 2.917-1.08 4.716V147h-10.284Zm98.725-25.568V147h-10.284V88.818h10.056v21.96h.512c1.023-2.462 2.604-4.403 4.744-5.823 2.159-1.44 4.905-2.16 8.239-2.16 3.03 0 5.672.635 7.926 1.904 2.254 1.269 3.996 3.125 5.227 5.568 1.25 2.443 1.875 5.426 1.875 8.949V147h-10.284v-26.193c0-2.936-.758-5.218-2.273-6.847-1.496-1.648-3.598-2.471-6.306-2.471-1.819 0-3.447.397-4.887 1.193-1.42.776-2.538 1.903-3.352 3.38-.796 1.478-1.193 3.268-1.193 5.37Zm56.496 26.42c-4.375 0-8.153-.909-11.335-2.727-3.163-1.837-5.597-4.432-7.301-7.784-1.705-3.371-2.557-7.339-2.557-11.903 0-4.489.852-8.429 2.557-11.819 1.723-3.409 4.129-6.06 7.216-7.954 3.087-1.913 6.714-2.87 10.881-2.87 2.689 0 5.227.436 7.613 1.307a17.212 17.212 0 0 1 6.364 3.978c1.856 1.799 3.314 4.09 4.375 6.875 1.06 2.765 1.591 6.06 1.591 9.886v3.153h-35.767v-6.932h25.909c-.019-1.969-.445-3.721-1.279-5.255a9.294 9.294 0 0 0-3.494-3.665c-1.477-.89-3.201-1.335-5.17-1.335-2.103 0-3.949.511-5.54 1.534a10.568 10.568 0 0 0-3.722 3.977c-.871 1.629-1.316 3.419-1.335 5.37v6.051c0 2.538.464 4.716 1.392 6.534.928 1.799 2.225 3.182 3.892 4.147 1.667.947 3.617 1.421 5.852 1.421 1.497 0 2.851-.208 4.063-.625a9.01 9.01 0 0 0 3.153-1.904c.89-.833 1.563-1.865 2.017-3.096l9.603 1.079c-.606 2.538-1.762 4.754-3.466 6.648-1.686 1.875-3.845 3.334-6.478 4.375-2.632 1.023-5.644 1.534-9.034 1.534Zm26.504-.852v-43.636h9.972v7.272h.454c.796-2.519 2.159-4.46 4.091-5.824 1.951-1.382 4.176-2.073 6.676-2.073.568 0 1.203.028 1.904.085a12.77 12.77 0 0 1 1.789.199v9.46c-.435-.152-1.127-.284-2.074-.398a19.16 19.16 0 0 0-2.698-.199c-1.875 0-3.561.408-5.057 1.222a8.935 8.935 0 0 0-3.495 3.324c-.852 1.42-1.278 3.059-1.278 4.915V147h-10.284Zm47.64.852c-4.375 0-8.153-.909-11.335-2.727-3.163-1.837-5.597-4.432-7.301-7.784-1.705-3.371-2.557-7.339-2.557-11.903 0-4.489.852-8.429 2.557-11.819 1.723-3.409 4.128-6.06 7.216-7.954 3.087-1.913 6.714-2.87 10.88-2.87 2.69 0 5.228.436 7.614 1.307a17.22 17.22 0 0 1 6.364 3.978c1.856 1.799 3.314 4.09 4.375 6.875 1.06 2.765 1.59 6.06 1.59 9.886v3.153h-35.767v-6.932h25.909c-.018-1.969-.445-3.721-1.278-5.255a9.294 9.294 0 0 0-3.494-3.665c-1.478-.89-3.201-1.335-5.171-1.335-2.102 0-3.949.511-5.539 1.534a10.568 10.568 0 0 0-3.722 3.977c-.871 1.629-1.316 3.419-1.335 5.37v6.051c0 2.538.464 4.716 1.392 6.534.928 1.799 2.225 3.182 3.892 4.147 1.666.947 3.617 1.421 5.852 1.421 1.496 0 2.85-.208 4.063-.625a9.01 9.01 0 0 0 3.153-1.904c.89-.833 1.562-1.865 2.017-3.096l9.602 1.079c-.606 2.538-1.761 4.754-3.466 6.648-1.685 1.875-3.844 3.334-6.477 4.375-2.632 1.023-5.644 1.534-9.034 1.534Z"
          />
        </svg>
      </h1>
      <p>
        The world's leading AI-powered collaboration protocol for blockchain
        metadata.
      </p>
    </div>
  )
}

export default Title
