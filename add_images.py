import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = {
    'Vanguard': 'mc-plan1.png',
    'Invader': 'mc-plan2.png',
    'Starter': 'mc-starter.png',
    'Astronaut': 'mc-plan3.png',
    'Scientist': 'mc-plan4.png',
    'Spark': 'bot-plan1.png',
    'Reactor': 'bot-plan2.png',
    'Matrix': 'bot-plan3.png'
}

for plan_name, img_file in replacements.items():
    # Insert image tag right before <h3 class="plan-name">PlanName</h3>
    pattern = rf'(<h3 class="plan-name">{plan_name}</h3>)'
    img_tag = f'<img src="img/{img_file}" alt="{plan_name} plan" class="plan-image">\n            '
    html = re.sub(pattern, img_tag + r'\1', html)

# Favicon
favicon_tag = '<link rel="icon" href="img/mc-starter.png" type="image/png">\n  <title>'
html = html.replace('<title>', favicon_tag)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
