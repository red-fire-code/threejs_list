 				attribute vec4 a_position;
        uniform mat4 u_formMatrix;
				attribute vec2 a_TextCoord;
        attribute vec4 a_color;
        varying vec4 color;
				varying vec2 v_TexCoord;
        void main(void){
            gl_Position = u_formMatrix * a_position;
            color = a_color;
						v_TexCoord = a_TextCoord; 
        }