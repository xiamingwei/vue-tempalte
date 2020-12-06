<template>
    <i :class="`common-icon common-icon-${type}`" :style="styles"></i>
</template>

<script>
    export default {
        name: 'common-icon',
        props: {
            type: {
                type: String,
                required: true
            },
            color: {
                type: String,
                default: '#fff'
            },
            size: {
                type: Number,
                default: 16
            }
        },
        computed: {
            styles () {
                return {
                    fontSize: `${this.size}px`,
                    color: this.color
                }
            }
        }
    }
</script>