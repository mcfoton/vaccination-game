from django import template

register = template.Library()

@register.filter(is_safe=True)
def ul_split(value, css_class=None):
    if css_class:
        ul = '<ul class="%s">' % css_class
    else:
        ul = '<ul>'

    for item in value.split(';'):
        if item:
            ul += '<li>%s</li>' % item

    ul += '</ul>'
    return ul

@register.filter
def index(value, index):
    return value[index]
