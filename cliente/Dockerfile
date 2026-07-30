COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=https://ayuda-animal-murcia-web.onrender.com
ARG VITE_IMGBB_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMGBB_KEY=$VITE_IMGBB_KEY
