FROM python:3.9

# Install Java manually
RUN curl -LO "https://download.java.net/java/GA/jdk11/13/GPL/openjdk-11.0.2_linux-x64_bin.tar.gz" && \
    tar -xvf openjdk-11.0.2_linux-x64_bin.tar.gz && \
    mv jdk-11.0.2 /usr/local/ && \
    rm openjdk-11.0.2_linux-x64_bin.tar.gz

# Set JAVA_HOME
ENV JAVA_HOME=/usr/local/jdk-11.0.2
ENV PATH=$JAVA_HOME/bin:$PATH

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "app.py"]
