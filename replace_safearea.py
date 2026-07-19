import os
import re

src_dir = '/home/barhoum/motioncare/src'

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if SafeAreaView is imported from react-native
            if 'SafeAreaView' in content and "'react-native'" in content:
                # Remove SafeAreaView from react-native import
                content = re.sub(r'SafeAreaView,\s*', '', content)
                content = re.sub(r',\s*SafeAreaView', '', content)
                content = re.sub(r'{\s*SafeAreaView\s*} from \'react-native\'', "{} from 'react-native'", content)
                
                # Add import from react-native-safe-area-context
                if 'react-native-safe-area-context' not in content:
                    content = "import { SafeAreaView } from 'react-native-safe-area-context';\n" + content

                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
