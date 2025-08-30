#!/bin/bash

# CI Debug File Check Script
# Checks for existence and correct casing of UI component files
# Optionally restores missing files from git if available

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Files to check with their expected paths
FILES_TO_CHECK=(
    "src/components/ui/button.tsx"
    "src/components/ui/card.tsx"
    "src/components/ui/badge.tsx"
    "src/components/ui/tabs.tsx"
    "src/components/ui/input.tsx"
)

echo "🔍 Checking UI component files..."
echo "======================================"

missing_files=()
all_files_ok=true

# Check each file
for file in "${FILES_TO_CHECK[@]}"; do
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✅ OK${NC}: $file"
    else
        echo -e "${RED}❌ MISSING${NC}: $file"
        missing_files+=("$file")
        all_files_ok=false
    fi
done

echo ""

# If files are missing, try to restore them from git
if [[ ${#missing_files[@]} -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  Found ${#missing_files[@]} missing file(s)${NC}"
    echo ""
    
    # Attempt to restore missing files from git
    echo "🔄 Attempting to restore missing files from git..."
    for file in "${missing_files[@]}"; do
        echo "   Trying to restore: $file"
        if git checkout origin/main -- "$file" 2>/dev/null; then
            echo -e "   ${GREEN}✅ Restored${NC}: $file"
            # Remove from missing files array if successfully restored
            for i in "${!missing_files[@]}"; do
                if [[ ${missing_files[i]} == "$file" ]]; then
                    unset 'missing_files[i]'
                fi
            done
        else
            echo -e "   ${RED}❌ Could not restore${NC}: $file"
        fi
    done
    
    # Rebuild missing files array to remove restored files
    missing_files=("${missing_files[@]}")
    echo ""
fi

# Summary and instructions
if [[ ${#missing_files[@]} -eq 0 ]] && [[ $all_files_ok == true ]]; then
    echo -e "${GREEN}🎉 All UI component files are present!${NC}"
    exit 0
elif [[ ${#missing_files[@]} -eq 0 ]]; then
    echo -e "${GREEN}🎉 All missing files have been restored!${NC}"
    exit 0
else
    echo -e "${RED}❌ The following files are still missing:${NC}"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo -e "${YELLOW}📋 Summary Instructions:${NC}"
    echo "   1. Create the missing UI component files listed above"
    echo "   2. Ensure they follow the shadcn/ui pattern"
    echo "   3. Check that file names match exactly (case-sensitive)"
    echo "   4. Common shadcn/ui components can be installed with:"
    echo "      npx shadcn@latest add button card badge tabs input"
    echo "   5. Or manually create them following the project structure"
    echo ""
    exit 1
fi
