#!/bin/bash
# Initialize the docs/ directory structure for IDD artifacts.
# Called by IDD commands at the start of each workflow.

set -e

DOCS_DIR="docs"

mkdir -p "$DOCS_DIR/products"
mkdir -p "$DOCS_DIR/intentions"
mkdir -p "$DOCS_DIR/expectations"
mkdir -p "$DOCS_DIR/specs"
mkdir -p "$DOCS_DIR/reviews"

echo "IDD docs structure initialized at $DOCS_DIR/"
