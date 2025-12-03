#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to handle errors
error_handler() {
    echo "❌ Error: Compilation failed."
    echo "👉 If you see 'permission denied' above, try running with sudo:"
    echo "   sudo ./compile_wasm.sh"
    exit 1
}

# Trap errors
trap 'error_handler' ERR

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🐳 Checking for emcc or docker..."

# Check for emcc (Emscripten)
if command_exists emcc; then
    BUILD_MODE="local"
    echo "✅ Found emcc. Using local Emscripten."
elif command_exists docker; then
    BUILD_MODE="docker"
    echo "⚠️  emcc not found, but found docker."
    echo "🐳 Using emscripten/emsdk docker image..."
else
    echo "❌ Error: Neither 'emcc' nor 'docker' found."
    echo "👉 Please install Emscripten (https://emscripten.org/docs/getting_started/downloads.html)"
    echo "   OR install Docker to run the compiler in a container."
    exit 1
fi

echo "🚀 Starting compilation..."

# Define common flags
# Note: We escape the double quotes for the JSON array, but do NOT wrap the array in single quotes
# because when $FLAGS is expanded, we want emcc to see the raw JSON string.
FLAGS="-s WASM=1 -s EXPORTED_RUNTIME_METHODS=[\"ccall\",\"cwrap\",\"allocate\",\"UTF8ToString\",\"intArrayFromString\",\"getValue\",\"setValue\"] -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -O3"

# 1. Arbitrary Precision Calculator
echo "🔨 Compiling Arbitrary Precision Calculator..."
if [ "$BUILD_MODE" = "docker" ]; then
    docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk emcc Arbitrary-Precision-Calculator/wasm_interface.c \
     Arbitrary-Precision-Calculator/addition.c \
     Arbitrary-Precision-Calculator/subtraction.c \
     Arbitrary-Precision-Calculator/multiplication.c \
     Arbitrary-Precision-Calculator/division.c \
     Arbitrary-Precision-Calculator/valid.c \
     -o apc.js $FLAGS -s EXPORTED_FUNCTIONS='["_calculate_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createAPCModule'
else
    emcc Arbitrary-Precision-Calculator/wasm_interface.c \
     Arbitrary-Precision-Calculator/addition.c \
     Arbitrary-Precision-Calculator/subtraction.c \
     Arbitrary-Precision-Calculator/multiplication.c \
     Arbitrary-Precision-Calculator/division.c \
     Arbitrary-Precision-Calculator/valid.c \
     -o apc.js $FLAGS -s EXPORTED_FUNCTIONS='["_calculate_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createAPCModule'
fi

# 2. Inverted Search Engine
echo "🔨 Compiling Inverted Search Engine..."
if [ "$BUILD_MODE" = "docker" ]; then
    docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk emcc Inverted-Search-using-hashtable/wasm_inverted_search.c \
     Inverted-Search-using-hashtable/create.c \
     Inverted-Search-using-hashtable/search.c \
     Inverted-Search-using-hashtable/save.c \
     Inverted-Search-using-hashtable/update.c \
     Inverted-Search-using-hashtable/display.c \
     Inverted-Search-using-hashtable/invert.c \
     -o inverted_search.js $FLAGS -s EXPORTED_FUNCTIONS='["_init_system", "_add_file_to_index", "_search_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createISModule'
else
    emcc Inverted-Search-using-hashtable/wasm_inverted_search.c \
     Inverted-Search-using-hashtable/create.c \
     Inverted-Search-using-hashtable/search.c \
     Inverted-Search-using-hashtable/save.c \
     Inverted-Search-using-hashtable/update.c \
     Inverted-Search-using-hashtable/display.c \
     Inverted-Search-using-hashtable/invert.c \
     -o inverted_search.js $FLAGS -s EXPORTED_FUNCTIONS='["_init_system", "_add_file_to_index", "_search_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createISModule'
fi

# 3. MP3 Tag Reader
echo "🔨 Compiling MP3 Tag Reader..."
if [ "$BUILD_MODE" = "docker" ]; then
    docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk emcc mp3_tag_read_edit/wasm_mp3.c \
     mp3_tag_read_edit/fun.c \
     -o mp3_reader.js $FLAGS -s EXPORTED_FUNCTIONS='["_read_tags_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createMP3Module'
else
    emcc mp3_tag_read_edit/wasm_mp3.c \
     mp3_tag_read_edit/fun.c \
     -o mp3_reader.js $FLAGS -s EXPORTED_FUNCTIONS='["_read_tags_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createMP3Module'
fi

# 4. LSB Image Steganography
echo "🔨 Compiling LSB Image Steganography..."
if [ "$BUILD_MODE" = "docker" ]; then
    docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk emcc Stegnograph/wasm_stego.c \
     Stegnograph/encode.c \
     Stegnograph/decode.c \
     -o stego.js $FLAGS -s EXPORTED_FUNCTIONS='["_encode_wasm", "_decode_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createStegoModule'
else
    emcc Stegnograph/wasm_stego.c \
     Stegnograph/encode.c \
     Stegnograph/decode.c \
     -o stego.js $FLAGS -s EXPORTED_FUNCTIONS='["_encode_wasm", "_decode_wasm", "_malloc", "_free"]' \
     -s MODULARIZE=1 -s EXPORT_NAME='createStegoModule'
fi

echo "✅ Compilation complete!"
echo "📂 Generated files: apc.js, inverted_search.js, mp3_reader.js, stego.js (and .wasm files)"
